import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    itemsPrice,
    shippingPrice,
    discountAmount,
    totalAmount,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    try {
      setApplyingCoupon(true);
      await applyCoupon(couponCodeInput.trim());
      setCouponCodeInput('');
    } catch {
      // Toast handles error
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-kenzna-brown font-tajawal">سلتك فارغة 🛒</h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            لم تقم بإضافة أي منتج إلى سلة مشترياتك بعد. استكشف تشكيلتنا الفاخرة من الفواكه الجافة والمكسرات.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-md hover:scale-105 transition-all"
        >
          <span>ابدأ التسوق الآن</span>
          <ArrowLeft size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="space-y-1 text-right">
          <h1 className="text-2xl sm:text-3xl font-black text-kenzna-brown font-tajawal">
            سلة المشتريات
          </h1>
          <p className="text-xs text-stone-500">
            لديك <span className="font-bold text-stone-800 font-mono">{cartItems.length}</span> أصناف في السلة
          </p>
        </div>

        <Link
          to="/products"
          className="text-xs font-bold text-kenzna-amber hover:text-kenzna-brown flex items-center gap-1"
        >
          <ArrowRight size={14} />
          <span>مواصلة التسوق</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List & Shipping Indicator */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Bar */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft text-right space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-stone-800 flex items-center gap-2">
                <Truck size={18} className="text-kenzna-amber" />
                {itemsPrice >= 300 ? (
                  <span className="text-emerald-700 font-bold">تهانينا! طلبيتك مؤهلة للتوصيل المجاني إلى باب بيتك 🎉</span>
                ) : (
                  <span>
                    أضف منتجات بقيمة <strong className="text-kenzna-amber font-mono font-black">{formatPrice(300 - itemsPrice)}</strong> للاستفادة من <strong>التوصيل المجاني</strong>!
                  </span>
                )}
              </span>
              <span className="text-xs font-mono font-bold text-stone-500">
                {Math.min(100, Math.round((itemsPrice / 300) * 100))}%
              </span>
            </div>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-kenzna-amber to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (itemsPrice / 300) * 100)}%` }}
              />
            </div>
          </div>
          {cartItems.map((item) => (
            <div
              key={`${item.product}-${item.weight}`}
              className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-stone-200"
                />
                <div className="space-y-1 text-right">
                  <Link
                    to={`/products/${item.product}`}
                    className="font-bold text-sm sm:text-base text-stone-900 hover:text-kenzna-amber line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-kenzna-amber-light text-kenzna-amber font-bold px-2 py-0.5 rounded-lg">
                      الوزن: {item.weight}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      ({formatPrice(item.price)} / حبة)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Total for Item */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-stone-100">
                {/* Quantity Controls */}
                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.product, item.weight, item.quantity - 1)}
                    className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-stone-900 font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product, item.weight, item.quantity + 1)}
                    className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="text-base font-black text-kenzna-brown font-mono min-w-[90px] text-left">
                  {formatPrice(item.price * item.quantity)}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.product, item.weight)}
                  className="p-2 text-stone-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
                  title="حذف من السلة"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {/* Shipping Free Notice Bar */}
          <div className="bg-kenzna-beige p-4 rounded-2xl border border-amber-900/10 flex items-center justify-between text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-kenzna-amber" />
              <span>
                {itemsPrice >= 300
                  ? 'تهانينا! لقد حصلت على توصيل مجاني لباب منزلك 🎉'
                  : `أضف منتجات بقيمة ${formatPrice(300 - itemsPrice)} إضافية للحصول على توصيل مجاني!`}
              </span>
            </div>
            {itemsPrice < 300 && (
              <Link to="/products" className="font-bold text-kenzna-amber hover:underline shrink-0">
                تصفح المنتجات
              </Link>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-5">
            <h3 className="font-bold text-lg text-stone-900 pb-3 border-b border-stone-100">
              ملخص الفاتورة
            </h3>

            {/* Coupon Code Input */}
            <div>
              {coupon ? (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Tag size={16} />
                    <span>الكوبون: {coupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    حذف
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="رمز الكوبون (مثال: KENZNA10)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-stone-50 border border-stone-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-kenzna-amber"
                  />
                  <button
                    type="submit"
                    disabled={applyingCoupon}
                    className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    {applyingCoupon ? '...' : 'تطبيق'}
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span>مجموع المنتجات:</span>
                <span className="font-bold text-stone-900 font-mono text-sm">{formatPrice(itemsPrice)}</span>
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
                  <span>الخصم المطبق:</span>
                  <span className="font-mono text-sm">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-base font-black text-stone-900 pt-3 border-t border-stone-200">
                <span>المجموع النهائي:</span>
                <span className="text-xl text-kenzna-amber font-mono font-black">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-kenzna-amber hover:bg-kenzna-amber-hover text-white py-4 rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>متابعة الطلب (الدفع عند الاستلام)</span>
              <ArrowLeft size={18} />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 space-y-2 text-xs text-stone-500">
            <div className="flex items-center gap-2 text-stone-700 font-bold">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>تسوق آمن ومضمون 100%</span>
            </div>
            <p>لا نطلب منك أي بطاقة بنكية مسبقاً، الدفع نقداً عند استلام ومعاينة طلبك.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
