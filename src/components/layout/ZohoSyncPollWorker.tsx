import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export function ZohoSyncPollWorker() {
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const triggerSync = async (isQuiet = true) => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      
      try {
        const response = await axios.get('/api/zoho/poll');
        const data = response.data as any;
        
        if (data && data.success) {
          if (data.addedCount > 0 || data.updatedCount > 0) {
            toast.success('Zoho Sync Active', {
              description: `Synchronized ${data.addedCount} new and updated ${data.updatedCount} existing clients from Zoho Books.`,
              duration: 4000
            });
          }
        } else if (data && !data.success && !isQuiet) {
          console.warn('Zoho Background Polling warning:', data.message);
        }
      } catch (error) {
        console.error('Failed to auto-poll Zoho Books contacts:', error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    // Run first poll 3 seconds after application boot to keep UI load sequence clean
    const initialSyncTimer = setTimeout(() => {
      triggerSync(true);
    }, 3000);

    // Setup periodic polling interval of 5 minutes (300,000 milliseconds)
    const pollInterval = setInterval(() => {
      triggerSync(true);
    }, 300000);

    return () => {
      clearTimeout(initialSyncTimer);
      clearInterval(pollInterval);
    };
  }, []);

  // Worker runs entirely headless in background
  return null;
}
