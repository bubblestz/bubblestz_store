import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SettingsProvider } from '@/hooks/useSettings';
import './styles/tailwind.css';

// Lazy load or import components
import OrderDashboard from './app/order-dashboard/page';
import OrderDetails from './app/order-details/page';
import OrderHistory from './app/order-history/page';
import Settings from './app/settings/page';
import NotFound from './app/not-found';

function App() {
  return (
    <SettingsProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/order-dashboard" replace />} />
        <Route path="/order-dashboard" element={<OrderDashboard />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </SettingsProvider>
  );
}

export default App;
