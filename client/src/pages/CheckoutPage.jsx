import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ShieldCheck,
  Truck,
  CheckCircle,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Banknote,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

const MOROCCAN_CITIES = [
  'الدار البيضاء (Casablanca)',
  'الرباط (Rabat)',
  'مراكش (Marrakech)',
  'طنجة (Tangier)',
  'فاس (Fes)',
  'أكادير (Agadir)',
  'مكناس (Meknes)',
  'وجدة (Oujda)',
  'القنيطرة (Kenitra)',
  'تطوان (Tetouan)',
  'تمارة (Temara)',
  'الجديدة (El Jadida)',
  'بني ملال (Beni Mellal)',
  'المحمدية (Mohammedia)',
  'الناظور (Nador)',
  'آسفي (Safi)',
  'أرفود / الراشيدية',
  'ورزازات (Ouarzazate)',
  'العيون (Laayoune)',
  'مدينة أخرى بالمغرب',
];

const CheckoutPage = () => {
  const { cartItems, itemsPrice, shippingPrice, discountAmount, totalAmount, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  // Pre-fill if user has saved address
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || defaultAddress?.phone || '',
      email: user?.email || '',
      city: defaultAddress?.city || 'الدار البيضاء (Casablanca)',
      district: defaultAddress?.district || '',
      address: defaultAddress?.street || '',
      notes: '',
      paymentMethod: 'COD',
    },
  });

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);

      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          weight: item.weight,
          quantity: item.quantity,
          price: item.price,
        })),
        customerInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
        shippingAddress: {
          city: formData.city,
          district: formData.district,
          address: formData.address,
          notes: formData.notes,
        },
        paymentMethod: 'COD',
        couponCode: coupon?.code,
      };

      const { data: createdOrder } = await api.post('/orders', orderPayload);

      clearCart();
      toast.success('تم استلام طلبك بنجاح! 🎉');
      navigate(`/order-success/${createdOrder._id || createdOrder.orderNumber}`);
    } catch (error) {
      toast.error(error.message || 'فشل إرسال الطلب، يرجى المحاولة ثانية');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="space-y-1 text-right">
          <h1 className="text-2xl sm:text-3xl font-black text-kenzna-brown font-tajawal">
            إتمام الطلب وتأكيد التوصيل
          </h1>
          <p className="text-xs text-stone-500">
            أدخل معلومات التوصيل واستلم طلبك عند باب منزلك مع خدمة الدفع عند الاستلام
          </p>
        </div>

        <Link to="/cart" className="text-xs font-bold text-kenzna-amber flex items-center gap-1">
          <ArrowRight size={14} />
          <span>الرجوع للسلة</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Customer Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft space-y-5 text-right">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
                <UserIcon size={18} className="text-kenzna-amber" />
                <span>1. معلومات العميل للتواصل</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الاسم الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: يوسف العلمي"
                    {...register('fullName', { required: 'يرجى إدخال الاسم الكامل' })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                  />
                  {errors.fullName && (
                    <span className="text-[11px] text-rose-500 mt-1 block font-medium">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    رقم الهاتف (للتأكيد والتوصيل) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="06XXXXXXXX أو 07XXXXXXXX"
                    {...register('phone', {
                      required: 'يرجى إدخال رقم الهاتف',
                      pattern: {
                        value: /^(0|\+212)[5-7]\d{8}$/,
                        message: 'يرجى إدخال رقم هاتف مغربي صحيح',
                      },
                    })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber font-mono"
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-rose-500 mt-1 block font-medium">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    البريد الإلكتروني (اختياري لاستلام الفاتورة)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft space-y-5 text-right">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
                <MapPin size={18} className="text-kenzna-amber" />
                <span>2. عنوان التوصيل بالمغرب</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    المدينة <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register('city', { required: 'يرجى اختيار المدينة' })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber cursor-pointer"
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الحي / المنطقة
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: المعاريف، أكدال، جليز..."
                    {...register('district')}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    العنوان بالتفصيل (الشارع، رقم العمارة أو المنزل) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: شارع الحسن الثاني، إقامة النخيل عمارة ب شقة 4"
                    {...register('address', { required: 'يرجى إدخال العنوان الكامل' })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                  />
                  {errors.address && (
                    <span className="text-[11px] text-rose-500 mt-1 block font-medium">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ملاحظات إضافية للموزع (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة أو ترك الطلب عند الحارس..."
                    {...register('notes')}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-kenzna-amber"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft space-y-4 text-right">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
                <Banknote size={18} className="text-kenzna-amber" />
                <span>3. طريقة الدفع</span>
              </h3>

              <div className="border-2 border-kenzna-amber bg-amber-50/50 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-kenzna-amber text-white flex items-center justify-center font-bold">
                    <Banknote size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">
                      الدفع عند الاستلام (Paiement à la livraison)
                    </h4>
                    <p className="text-xs text-stone-500">
                      ادفع نقداً لمندوب التوصيل بعد استلام طلبك ومعاينته.
                    </p>
                  </div>
                </div>

                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  مفعل وآمن 100%
                </span>
              </div>
            </div>
          </div>

          {/* Right: Order Breakdown & Confirm Button */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-5 text-right">
              <h3 className="font-bold text-base text-stone-900 pb-3 border-b border-stone-100">
                مراجعة المنتجات ({cartItems.length})
              </h3>

              {/* Mini Item List */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-stone-100 pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.product}-${item.weight}`} className="pt-2 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 text-right">
                      <p className="font-bold text-xs text-stone-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-stone-500">
                        {item.weight} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-xs font-mono text-stone-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-stone-600 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <span>مجموع المنتجات:</span>
                  <span className="font-bold text-stone-900 font-mono">{formatPrice(itemsPrice)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>تكلفة التوصيل:</span>
                  <span className="font-bold text-stone-900 font-mono">
                    {shippingPrice === 0 ? (
                      <span className="text-emerald-600 font-bold">مجاني 🎉</span>
                    ) : (
                      formatPrice(shippingPrice)
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>الخصم ({coupon?.code}):</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-base font-black text-stone-900 pt-3 border-t border-stone-200">
                  <span>المبلغ الإجمالي للدفع:</span>
                  <span className="text-xl text-kenzna-amber font-mono font-black">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-kenzna-amber hover:bg-kenzna-amber-hover text-white py-4 rounded-2xl font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <span>جاري تسجيل وتأكيد الطلب...</span>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>تأكيد الطلب الآن ({formatPrice(totalAmount)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
