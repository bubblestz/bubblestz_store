'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Order,
  formatCurrency,
  formatDateTime,
} from '@/lib/mockData';
import { OrderStatus, STATUS_META } from '@/components/ui/StatusBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { getOrders } from '@/lib/orders';

type SortKey = 'id' | 'total_price' | 'created_at';
type SortDir = 'asc' | 'desc';

const ALL_STATUSES: OrderStatus[] = [
  'Pending',
  'Picked Up',
  'Washing',
  'Drying',
  'Ready',
  'Delivered',
  'Cancelled',
];

export default function OrderHistoryTable() {
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilters, setStatusFilters] = useState<OrderStatus[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const refreshOrders = useCallback(async () => {
    setIsLoading(true);
    const data = await getOrders();
    setAllOrders(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshOrders();

    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshOrders, 30000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  // Filtering
  const filtered = useMemo(() => {
    return allOrders.filter((order) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        order.id.toString().includes(q) ||
        (order.customer_name || '').toLowerCase().includes(q) ||
        (order.phone || '').includes(q) ||
        (order.address || '').toLowerCase().includes(q);
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(order.status);
      return matchesSearch && matchesStatus;
    });
  }, [allOrders, search, statusFilters]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortKey === 'id') {
        aVal = a.id;
        bVal = b.id;
      } else if (sortKey === 'total_price') {
        aVal = a.total_price || 0;
        bVal = b.total_price || 0;
      } else if (sortKey === 'created_at') {
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const toggleStatus = (s: OrderStatus) => {
    setStatusFilters((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilters([]);
    setPage(1);
  };

  const hasActiveFilters = search || statusFilters.length > 0;

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown size={12} className="text-slate-600" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-emerald-400" />
    ) : (
      <ChevronDown size={12} className="text-emerald-400" />
    );
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(10, 16, 35, 0.6)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Toolbar */}
      <div className="p-4 border-b border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by ID, name, phone, address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="
                w-full pl-9 pr-4 py-2 rounded-xl text-sm
                bg-slate-800/60 border border-slate-700/60
                text-slate-200 placeholder-slate-500
                focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20
                transition-all duration-150
              "
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
              transition-all duration-150 border
              ${
                showFilters
                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 border-slate-700/60 hover:bg-white/5'
              }
            `}
          >
            <SlidersHorizontal size={14} />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          {/* Refresh */}
          <button
            onClick={refreshOrders}
            disabled={isLoading}
            className="
            flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
            text-slate-400 hover:text-slate-200 border border-slate-700/60 hover:bg-white/5
            transition-all duration-150 disabled:opacity-50
          "
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-3 fade-in">
            {/* Status filters */}
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">Status</p>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.map((s) => {
                  const meta = STATUS_META[s];
                  const active = statusFilters.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleStatus(s)}
                      className={`
                        flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
                        transition-all duration-150 border
                        ${
                          active
                            ? `border-opacity-40 text-white`
                            : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }
                      `}
                      style={
                        active
                          ? {
                              background: meta?.bgColor || 'rgba(255,255,255,0.05)',
                              borderColor: meta?.color ? meta.color + '60' : 'rgba(255,255,255,0.1)',
                              color: meta?.color || '#94a3b8',
                            }
                          : {}
                      }
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10 transition-all duration-150"
                >
                  <X size={11} />
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          <span className="text-slate-300 font-semibold tabular">{sorted.length}</span> orders
          {hasActiveFilters && (
            <span className="text-slate-500"> (filtered from {allOrders.length})</span>
          )}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Per page:</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none text-xs"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {[
                { label: 'Order ID', key: 'id' as SortKey, sortable: true },
                { label: 'Customer', key: null, sortable: false },
                { label: 'Total Price', key: 'total_price' as SortKey, sortable: true },
                { label: 'Created At', key: 'created_at' as SortKey, sortable: true },
                { label: 'Status', key: null, sortable: false },
                { label: 'Actions', key: null, sortable: false },
              ].map((col, i) => (
                <th
                  key={col.label || i}
                  className={`
                    px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wide whitespace-nowrap
                    ${col.sortable ? 'cursor-pointer hover:text-slate-300 select-none' : ''}
                  `}
                  onClick={
                    col.sortable && col.key ? () => handleSort(col.key as SortKey) : undefined
                  }
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && col.key && <SortIcon col={col.key as SortKey} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-24 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={24} className="animate-spin text-emerald-500" />
                    <p className="text-slate-400 font-medium">Loading orders history...</p>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                      <Search size={18} className="text-slate-600" />
                    </div>
                    <p className="text-slate-400 font-medium">No orders match your search</p>
                    <p className="text-xs text-slate-600">
                      Try adjusting your filters or search query
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((order, idx) => (
                <tr
                  key={order.id}
                  className="
                    border-b border-white/[0.03]
                    hover:bg-white/[0.03] transition-colors duration-100
                    cursor-pointer group
                  "
                  onClick={() => navigate(`/order-details?id=${order.id}`)}
                >
                  {/* Order ID */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-indigo-400">
                      #{order.id}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <p className="text-slate-200 font-medium text-xs whitespace-nowrap">
                      {order.customer_name}
                    </p>
                    <p className="text-slate-500 text-xs tabular">{order.phone}</p>
                  </td>

                  {/* Total Price */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold tabular text-emerald-300">
                      {formatCurrency(order.total_price || 0)}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDateTime(order.created_at)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/order-details?id=${order.id}`);
                      }}
                      className="
                        opacity-0 group-hover:opacity-100
                        w-7 h-7 rounded-lg inline-flex items-center justify-center
                        text-slate-500 hover:text-emerald-300 hover:bg-emerald-500/10
                        transition-all duration-150
                      "
                      title="View order details"
                    >
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sorted.length > 0 && (
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="text-slate-300 tabular">{(page - 1) * perPage + 1}</span> –{' '}
            <span className="text-slate-300 tabular">
              {Math.min(page * perPage, sorted.length)}
            </span>{' '}
            of <span className="text-slate-300 tabular">{sorted.length}</span> orders
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={12} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`
                    w-7 h-7 rounded-lg text-xs font-medium transition-all duration-150
                    ${
                      page === pageNum
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                    }
                  `}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
