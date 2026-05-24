// api/zoho/poll.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}
const db = getFirestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Support both GET and POST requests for easy polling and triggering
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }
  
  try {
      const docRef = db.collection('settings').doc('zoho');
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(200).json({ 
          success: false, 
          message: 'Zoho Books is not connected. Please connect from the Settings page.' 
        });
      }
      
      let tokens = docSnap.data();
      if (!tokens || !tokens.refresh_token) {
        return res.status(200).json({ 
          success: false, 
          message: 'Zoho Books credentials are incomplete. Please reconnect from the Settings page.' 
        });
      }
      
      // Refresh token if expired or close to expiration (with a 2-minute buffer)
      const isExpired = !tokens.expires_at || Date.now() + 120000 > tokens.expires_at;
      if (isExpired) {
          try {
              const refreshResponse = await axios.post(`https://accounts.zoho.eu/oauth/v2/token`, null, {
                  params: {
                    client_id: process.env.ZOHO_CLIENT_ID,
                    client_secret: process.env.ZOHO_CLIENT_SECRET,
                    refresh_token: tokens.refresh_token,
                    grant_type: 'refresh_token'
                  }
              });
              const refreshData = refreshResponse.data as any;
              
              if (refreshData && refreshData.access_token) {
                  tokens = { 
                    ...tokens, 
                    ...refreshData, 
                    expires_at: Date.now() + (refreshData.expires_in * 1000) 
                  };
                  await docRef.set(tokens);
              } else {
                  console.error('Failed to parse refresh response payload:', refreshData);
                  return res.status(200).json({ 
                    success: false, 
                    message: 'Could not refresh Zoho connection. Please reconnect.',
                    details: refreshData 
                  });
              }
          } catch (refreshErr: any) {
              console.error('Zoho OAuth Token Refresh Failed:', refreshErr.message);
              return res.status(200).json({ 
                success: false, 
                message: 'Failed to refresh Zoho session. Your connection might have expired.',
                error: refreshErr.message 
              });
          }
      }

      const orgId = process.env.ZOHO_ORG_ID;
      if (!orgId) {
        return res.status(200).json({ 
          success: false, 
          message: 'Zoho configuration is missing ZOHO_ORG_ID. Please configure in environment variables.' 
        });
      }

      // Retrieve Zoho Books contacts
      const response = await axios.get(`https://books.zoho.eu/api/v3/contacts`, {
          headers: { 
            'Authorization': `Zoho-oauthtoken ${tokens.access_token}`, 
            'Accept': 'application/json' 
          },
          params: {
            organization_id: orgId
          }
      });
      
      const zohoData = response.data as any;
      if (zohoData.code !== 0) {
        return res.status(200).json({ 
          success: false, 
          message: zohoData.message || 'Zoho Books API returned an error status.' 
        });
      }

      const zohoContacts = zohoData.contacts || [];
      
      // Fetch current clients in Firestore to cross-reference and prevent duplication
      const clientsSnapshot = await db.collection('clients').get();
      const existingClients = clientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Create maps for fast lookup
      const clientByZohoId = new Map<string, any>();
      const clientByEmail = new Map<string, any>();
      
      existingClients.forEach(c => {
        if (c.zohoContactId) {
          clientByZohoId.set(String(c.zohoContactId).trim(), c);
        }
        if (c.email) {
          clientByEmail.set(String(c.email).toLowerCase().trim(), c);
        }
      });

      let addedCount = 0;
      let updatedCount = 0;
      const syncedClients = [];

      for (const contact of zohoContacts) {
        const contactId = String(contact.contact_id || '').trim();
        const contactName = String(contact.contact_name || contact.customer_name || '').trim();
        const email = String(contact.email || '').toLowerCase().trim();
        const companyName = String(contact.company_name || '').trim();
        const phone = String(contact.phone || contact.mobile || '').trim();
        
        // Skip contacts with zero identifier or name
        if (!contactName || !contactId) continue;

        // Find existing matching records
        let matchedClient = clientByZohoId.get(contactId);
        if (!matchedClient && email) {
          matchedClient = clientByEmail.get(email);
        }

        // Prepare client document representation
        const clientData = {
          name: contactName,
          email: email || matchedClient?.email || '',
          phone: phone || matchedClient?.phone || '',
          companyName: companyName || matchedClient?.companyName || '',
          zohoContactId: contactId,
          syncStatus: 'synced' as const,
          lastSyncedAt: Date.now(),
          address: contact.address || matchedClient?.address || '',
          createdAt: matchedClient?.createdAt || Date.now()
        };

        if (matchedClient) {
          // If the matching client doesn't have the Zoho Contact ID linked yet,
          // or if other properties changed, update the record
          const hasVagueDifferences = 
            matchedClient.zohoContactId !== contactId ||
            matchedClient.name !== contactName ||
            (email && matchedClient.email !== email) ||
            (phone && matchedClient.phone !== phone) ||
            matchedClient.companyName !== companyName;

          if (hasVagueDifferences) {
            await db.collection('clients').doc(matchedClient.id).update(clientData);
            updatedCount++;
            syncedClients.push({ id: matchedClient.id, action: 'updated', name: contactName });
          }
        } else {
          // Add brand new client record to our Firestore database
          const newDoc = db.collection('clients').doc();
          await newDoc.set({
            ...clientData,
            id: newDoc.id
          });
          addedCount++;
          syncedClients.push({ id: newDoc.id, action: 'created', name: contactName });
        }
      }

      return res.status(200).json({
        success: true,
        message: `Successfully synchronized from Zoho Books. Added ${addedCount} new clients, updated ${updatedCount} existing entries.`,
        addedCount,
        updatedCount,
        syncedClients
      });
  } catch (error: any) {
      console.error('Zoho Background Connection Error during polling:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Sync polling operation failed.', 
        error: error.message || String(error),
        details: error.response?.data || null
      });
  }
}
