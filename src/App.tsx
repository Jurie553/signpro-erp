import React from 'react';
import { Routes, Route, Navigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { MainLayout } from '@/src/components/layout/MainLayout';
import { Toaster } from 'sonner';
import { ZohoSyncPollWorker } from '@/src/components/layout/ZohoSyncPollWorker';
import { useAuth } from '@/src/lib/authContext';

// Pages
import Dashboard from '@/src/pages/Dashboard';
import Clients from '@/src/pages/Clients';
import Materials from '@/src/pages/Materials';
import Suppliers from '@/src/pages/Suppliers';
import NCRBooks from '@/src/pages/NCRBooks';
import LithoProducts from '@/src/pages/LithoProducts';
import Packages from '@/src/pages/Packages';
import Quotes from '@/src/pages/Quotes';
import Jobs from '@/src/pages/Jobs';
import ProductionBoard from '@/src/pages/ProductionBoard';
import Machines from '@/src/pages/Machines';
import Inventory from '@/src/pages/Inventory';
import InventoryRegistryHub from '@/src/pages/InventoryRegistryHub';
import Purchasing from '@/src/pages/Purchasing';
import Reports from '@/src/pages/Reports';
import OrderHistory from '@/src/pages/OrderHistory';
import Settings from '@/src/pages/Settings';
import MachineUtilization from '@/src/pages/MachineUtilization';
import Departments from '@/src/pages/Departments';
import ClientApproval from '@/src/pages/ClientApproval';
import Login from '@/src/pages/Login';

function ApproveRedirect() {
  const { jobId } = useParams();
  return <Navigate to={`/approval/${jobId}`} replace />;
}

function QuoteRedirect() {
  const { quoteId } = useParams();
  return <Navigate to={`/approval/q/${quoteId}`} replace />;
}

function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="card-minimal max-w-sm w-full p-10 text-center">
          <p className="text-text-muted text-sm uppercase tracking-[0.3em]">Checking session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="card-minimal max-w-sm w-full p-10 text-center">
          <p className="text-text-muted text-sm uppercase tracking-[0.3em]">Checking session...</p>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : <Outlet />;
}

export default function App() {
  return (
    <>
      <ZohoSyncPollWorker />
      <Toaster position="top-right" expand={false} richColors />
      <Routes>
        <Route path="/approval/q/:quoteId" element={<ClientApproval />} />
        <Route path="/approval/:jobId" element={<ClientApproval />} />
        <Route path="/approve/:jobId" element={<ApproveRedirect />} />
        <Route path="/approve/q/:quoteId" element={<QuoteRedirect />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/inventory-registry" element={<InventoryRegistryHub />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/ncr-books" element={<NCRBooks />} />
            <Route path="/litho-products" element={<LithoProducts />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/production-board" element={<ProductionBoard />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchasing" element={<Purchasing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/utilization" element={<MachineUtilization />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/pricing-config" element={<Navigate to="/settings" replace />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
