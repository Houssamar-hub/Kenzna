import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Eye,
  CheckCircle2,
  Truck,
  Clock,
  Filter,
  X,
  Printer,
  ChevronDown,
  FileText,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatPrice, formatDate, orderStatusMap } from '../../utils/formatters';
import { downloadOrderInvoicePDF, downloadSalesReportPDF } from '../../utils/pdfGenerator';

const STATUS_STEPS = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== 'all' ? `/orders?status=${statusFilter}` : '/orders';
      const { data } = await api.get(url);
      setOrders(data);
    } catch {
      toast.error('فشل تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      const { data: updated } = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
        note: `تم تغيير حالة الطلب إلى ${orderStatusMap[newStatus]?.label || newStatus}`,
      });

      setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
      toast.success(`تم تحديث حالة الطلب إلى "${orderStatusMap[newStatus]?.label}" ✅`);
    } catch (err) {
      toast.error(err.message || 'فشل تحديث الحالة');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 text-right">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 font-tajawal">
            إدارة الطلبات والمبيعات ({orders.length})
          </h1>
          <p className="text-xs text-stone-500">تتبع الطلبات، تحديث حالات التوصيل، وإصدار الفواتير الرسمية</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadSalesReportPDF(orders)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download size={15} />
            <span>تحميل تقرير المبيعات (PDF) 📊</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-kenzna-amber text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            الكل
          </button>
          {STATUS_STEPS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-kenzna-amber text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              {orderStatusMap[st]?.label || st}
            </button>
          ))}
        </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
              <tr>
                <th className="py-4 px-4">رقم الطلب</th>
                <th className="py-4 px-4">الزبون / الهاتف</th>
                <th className="py-4 px-4">المدينة</th>
                <th className="py-4 px-4">عدد الأصناف</th>
                <th className="py-4 px-4">المبلغ الإجمالي</th>
                <th className="py-4 px-4">التاريخ</th>
                <th className="py-4 px-4">حالة الطلب</th>
                <th className="py-4 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((ord) => {
                const meta = orderStatusMap[ord.orderStatus] || orderStatusMap.Pending;
                return (
                  <tr key={ord._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold font-mono text-kenzna-brown">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">
                        {ord.customerInfo?.fullName || ord.user?.name}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {ord.customerInfo?.phone || ord.user?.phone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {ord.shippingAddress?.city}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                      {ord.items?.length || 0} أصناف
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-kenzna-amber">
                      {formatPrice(ord.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-400 font-mono">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                        disabled={updating}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border cursor-pointer focus:outline-none ${meta.color}`}
                      >
                        {STATUS_STEPS.map((st) => (
                          <option key={st} value={st}>
                            {orderStatusMap[st]?.label || st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => downloadOrderInvoicePDF(ord)}
                          className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors"
                          title="تحميل الفاتورة PDF"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-2 bg-stone-100 hover:bg-kenzna-amber hover:text-white rounded-xl transition-colors"
                          title="تفاصيل الطلب"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 text-right shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-kenzna-brown font-mono">
                  {selectedOrder.orderNumber}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    orderStatusMap[selectedOrder.orderStatus]?.color
                  }`}
                >
                  {orderStatusMap[selectedOrder.orderStatus]?.label}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer & Address Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-stone-800 block">معلومات العميل:</span>
                <p>الاسم: {selectedOrder.customerInfo?.fullName}</p>
                <p>الهاتف: {selectedOrder.customerInfo?.phone}</p>
                {selectedOrder.customerInfo?.email && <p>البريد: {selectedOrder.customerInfo?.email}</p>}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-stone-800 block">عنوان التوصيل:</span>
                <p>المدينة: {selectedOrder.shippingAddress?.city}</p>
                <p>العنوان: {selectedOrder.shippingAddress?.address}</p>
                {selectedOrder.shippingAddress?.notes && (
                  <p className="text-amber-800">ملاحظات: {selectedOrder.shippingAddress?.notes}</p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-stone-800">الأصناف المطلوبة:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-stone-900 block">{item.name}</span>
                        <span className="text-[11px] text-stone-400">
                          {item.weight} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-stone-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-sm font-bold">
              <span>المبلغ الإجمالي المستحق:</span>
              <span className="text-lg text-kenzna-amber font-mono font-black">
                {formatPrice(selectedOrder.totalAmount)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => downloadOrderInvoicePDF(selectedOrder)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-3 px-5 rounded-xl shadow-xs transition-colors"
              >
                <Download size={16} />
                <span>تحميل الفاتورة PDF</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-3 px-5 rounded-xl transition-colors"
              >
                <Printer size={16} />
                <span>طباعة</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-kenzna-brown text-white text-xs font-bold py-3 rounded-xl hover:bg-kenzna-brown-light transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
