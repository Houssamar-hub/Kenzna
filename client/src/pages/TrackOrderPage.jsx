import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { formatPrice, formatDate, orderStatusMap } from '../utils/formatters';
import { downloadOrderInvoicePDF } from '../utils/pdfGenerator';

const TRACKING_STEPS = [
  { key: 'Pending', label: 'تم الاستلام', desc: 'تم تسجيل طلبك في نظام كنزنا بنجاح' },
  { key: 'Confirmed', label: 'تم التأكيد', desc: 'تم التأكيد الهاتفي وجاري تحضير المنتجات' },
  { key: 'Preparing', label: 'قيد التعبئة', desc: 'يتم وزن وتغليف المكسرات بعناية فائقة' },
  { key: 'Shipped', label: 'في الطريق إليك', desc: 'تم تسليم الطلب للموزع في مدينتك' },
  { key: 'Delivered', label: 'تم التوصيل', desc: 'تم استلام الطلب والدفع بنجاح' },
];

const TrackOrderPage = () => {
  const [orderQuery, setOrderQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderQuery.trim()) {
      toast.error('يرجى إدخال رقم الطلب');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const { data } = await api.get(`/orders/track/${orderQuery.trim()}?phone=${encodeURIComponent(phoneQuery.trim())}`);
      setOrder(data);
    } catch (err) {
      // Fallback: try direct id lookup
      try {
        const { data } = await api.get(`/orders/${orderQuery.trim()}`);
        setOrder(data);
      } catch {
        setOrder(null);
        toast.error('لم نتمكن من العثور على الطلب. يرجى التحقق من الرقم');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepKey, currentStatus) => {
    const stepOrder = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Delivered'];
    const currentIndex = stepOrder.indexOf(currentStatus);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (currentStatus === 'Cancelled') return 'cancelled';
    if (stepIndex <= currentIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right font-cairo">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full inline-block font-tajawal">
          تتبع شحنتك لحظة بلحظة 🚚
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-kenzna-brown font-tajawal">
          تتبع حالة طلبك في كنزنا
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          أدخل رقم الطلب المسجل لديك لمعرفة تفاصيل الشحن والتوصيل وتحميل الفاتورة
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              رقم الطلب (Order Number) *
            </label>
            <input
              type="text"
              placeholder="مثال: KZ-12345 أو معرف الطلب"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono focus:outline-none focus:border-kenzna-amber"
              required
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              رقم الهاتف (اختياري للتحقق)
            </label>
            <input
              type="tel"
              placeholder="06XXXXXXXX"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono focus:outline-none focus:border-kenzna-amber"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-kenzna-amber hover:bg-kenzna-amber-hover text-white py-3 px-4 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>جاري البحث...</span>
              ) : (
                <>
                  <Search size={16} />
                  <span>تتبع الآن</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {order ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6 animate-fade-in">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
            <div>
              <span className="text-xs text-stone-400">طلب رقم:</span>
              <h2 className="text-xl font-black text-kenzna-brown font-mono mr-2 inline-block">
                #{order.orderNumber}
              </h2>
              <span className="text-xs text-stone-400 block sm:inline mr-3 font-mono">
                • {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${orderStatusMap[order.orderStatus]?.color}`}>
                {orderStatusMap[order.orderStatus]?.label || order.orderStatus}
              </span>
              <button
                onClick={() => downloadOrderInvoicePDF(order)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <FileText size={14} />
                <span>تحميل الفاتورة PDF</span>
              </button>
            </div>
          </div>

          {/* Tracking Timeline Stepper */}
          <div className="py-4">
            <h3 className="text-xs font-bold text-stone-500 mb-6 uppercase tracking-wider">مراحل التوصيل:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {TRACKING_STEPS.map((step, idx) => {
                const status = getStepStatus(step.key, order.orderStatus);
                const isCompleted = status === 'completed';

                return (
                  <div
                    key={step.key}
                    className={`p-4 rounded-2xl border transition-all text-center space-y-2 ${
                      isCompleted
                        ? 'bg-amber-50/70 border-kenzna-amber/40 text-stone-900 shadow-xs'
                        : 'bg-stone-50/50 border-stone-100 text-stone-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                        isCompleted ? 'bg-kenzna-amber text-white' : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <h4 className="font-bold text-xs">{step.label}</h4>
                    <p className="text-[10px] leading-tight text-stone-500">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-stone-800 block">عنوان التوصيل:</span>
              <p className="text-stone-600">{order.shippingAddress?.city} - {order.shippingAddress?.address}</p>
              <p className="text-stone-500">المستلم: {order.customerInfo?.fullName}</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-stone-800 block">الملخص المالي:</span>
              <p className="text-stone-600">طريقة الدفع: الدفع عند الاستلام 💵</p>
              <p className="font-black text-kenzna-amber font-mono text-sm">المجموع: {formatPrice(order.totalAmount)}</p>
            </div>
          </div>
        </div>
      ) : searched && !loading ? (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-3">
          <AlertCircle size={36} className="mx-auto text-amber-600" />
          <h3 className="font-bold text-stone-800 text-sm">لم يتم العثور على الطلب</h3>
          <p className="text-xs text-stone-500">تأكد من كتابة رقم الطلب بالشكل الصحيح أو تواصل مع خدمة العملاء.</p>
        </div>
      ) : null}
    </div>
  );
};

export default TrackOrderPage;
