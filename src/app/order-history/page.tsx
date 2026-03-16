import AppLayout from '@/components/AppLayout';
import OrderHistoryTable from './components/OrderHistoryTable';
import { ClipboardList } from 'lucide-react';

export default function OrderHistoryPage() {
  return (
    <AppLayout
      pageTitle="Order History"
      pageSubtitle="Complete searchable record of all orders"
    >
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(129, 140, 248, 0.15)',
                border: '1px solid rgba(129, 140, 248, 0.25)',
              }}
            >
              <ClipboardList size={18} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-100">Order History</h1>
              <p className="text-xs text-slate-500">All orders — search, filter, and export</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <OrderHistoryTable />
      </div>
    </AppLayout>
  );
}
