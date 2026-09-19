import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Truck,
  PhoneCall,
  Clock,
  ArrowLeft,
  MapPin,
  Sparkles,
  ShoppingBag,
  FileText,
  Download,
  X,
  Check,
  Eye,
} from 'lucide-react';
import api from '../services/api';
import { formatPrice, formatDate, orderStatusMap } from '../utils/formatters';
import { downloadOrderInvoicePDF } from '../utils/pdfGenerator';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        // Automatically pop up the invoice download modal after order confirmation!
        setTimeout(() => {
          setShowModal(true);
        }, 600);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleDownloadAndClose = async () => {
    if (!order) return;
    await downloadOrderInvoicePDF(order);
    setDownloaded(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-center">
      {/* Success Badge & Headline */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-card space-y-6">
        <div className="w-20 h-20 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle size={44} />
        </div>

        <div className="space-y-2">
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full inline-block">
            تم تسجيل طلبك بنجاح
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-kenzna-brown font-tajawal">
            تم استلام طلبك بنجاح 🎉
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            شكراً لثقتك في كنزنا! سنقوم بالتواصل معك هاتفياً لتأكيد العنوان وشحن طلبك بأعلى معايير الجودة.
          </p>
        </div>

        {/* Order Metadata Box */}
        {order && (
          <div className="bg-kenzna-cream/80 rounded-2xl p-6 border border-amber-900/10 text-right space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-amber-900/10 text-xs">
              <div>
                <span className="text-stone-500 block">رقم الطلب:</span>
                <strong className="text-sm font-black text-kenzna-brown font-mono">{order.orderNumber}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">المبلغ الإجمالي:</span>
                <strong className="text-sm font-black text-kenzna-amber font-mono">{formatPrice(order.totalAmount)}</strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-stone-500 block">طريقة الدفع:</span>
                <strong className="text-stone-800 font-bold">الدفع عند الاستلام 💵</strong>
              </div>
            </div>

            {/* Delivery address & Contact */}
            <div className="text-xs text-stone-600 space-y-1.5">
              <p>
                <strong className="text-stone-800">المستلم:</strong> {order.customerInfo?.fullName} ({order.customerInfo?.phone})
              </p>
              <p>
                <strong className="text-stone-800">عنوان التوصيل:</strong> {order.shippingAddress?.city} - {order.shippingAddress?.address}
              </p>
            </div>

            {/* Items summary */}
            <div className="pt-3 border-t border-amber-900/10 space-y-2">
              <h4 className="font-bold text-xs text-stone-800">الأصناف المطلوبة:</h4>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-stone-700 bg-white/70 p-2 rounded-xl">
                    <span>{item.name} ({item.weight}) × {item.quantity}</span>
                    <span className="font-mono font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick PDF Action in metadata box */}
            <div className="pt-3 border-t border-amber-900/10 flex justify-end">
              <button
                onClick={() => downloadOrderInvoicePDF(order)}
                className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-kenzna-brown border border-stone-300 font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all hover:border-kenzna-amber"
              >
                <FileText size={15} className="text-kenzna-amber" />
                <span>تحميل وصل الطلب (PDF) 📄</span>
              </button>
            </div>
          </div>
        )}

        {/* Timeline Next Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right pt-4">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1">
            <div className="flex items-center gap-2 text-kenzna-amber font-bold text-xs">
              <PhoneCall size={16} />
              <span>1. التأكيد الهاتفي</span>
            </div>
            <p className="text-[11px] text-stone-500">سنتصل بك لتأكيد طلبك وتجهيزه فوراً.</p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1">
            <div className="flex items-center gap-2 text-kenzna-amber font-bold text-xs">
              <Package size={16} />
              <span>2. التعبئة والتغليف</span>
            </div>
            <p className="text-[11px] text-stone-500">تغليف محكم وصحي يحفظ القرمشة والجودة.</p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1">
            <div className="flex items-center gap-2 text-kenzna-amber font-bold text-xs">
              <Truck size={16} />
              <span>3. التوصيل السريع</span>
            </div>
            <p className="text-[11px] text-stone-500">يصلك المندوب لباب منزلك خلال 24 - 48 ساعة.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          {order && (
            <button
              onClick={() => downloadOrderInvoicePDF(order)}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-md transition-all hover:scale-105"
            >
              <Download size={18} />
              <span>تحميل الفاتورة الرسمية PDF</span>
            </button>
          )}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-md transition-all hover:scale-105"
          >
            <ShoppingBag size={18} />
            <span>مواصلة التسوق</span>
          </Link>

          <Link
            to="/account?tab=orders"
            className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-full transition-all"
          >
            <span>تتبع طلبي في الحساب</span>
          </Link>
        </div>
      </div>

      {/* AUTO POPUP MODAL: Instant Invoice PDF Download */}
      {showModal && order && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-right shadow-2xl border border-amber-900/10 relative transform transition-all scale-100">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute left-5 top-5 p-1.5 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Header Icon & Title */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-16 h-16 mx-auto bg-amber-50 border-2 border-kenzna-amber/30 text-kenzna-amber rounded-2xl flex items-center justify-center shadow-inner">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-black text-kenzna-brown font-tajawal">
                فاتورة ووصل الطلب جاهزة للتحميل 📄
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                تم إنشاء فاتورة طلبك الرسمية برقم <strong className="text-kenzna-brown font-mono">#{order.orderNumber}</strong>. هل ترغب في تنزيلها بصيغة PDF؟
              </p>
            </div>

            {/* Invoice Summary Box */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">اسم العميل:</span>
                <span className="font-bold text-stone-900">{order.customerInfo?.fullName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">مدينة التوصيل:</span>
                <span className="font-bold text-stone-900">{order.shippingAddress?.city}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">طريقة الدفع:</span>
                <span className="font-bold text-emerald-700">الدفع عند الاستلام 💵</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-stone-900">المبلغ الإجمالي:</span>
                <span className="text-base font-black text-kenzna-amber font-mono">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleDownloadAndClose}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-black py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                {downloaded ? (
                  <>
                    <Check size={18} />
                    <span>تم التحميل بنجاح! تحميل مجدداً</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>تحميل الفاتورة PDF الآن (Download PDF)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-2.5 rounded-xl transition-colors"
              >
                لاحقاً / إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSuccessPage;
