import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowLeft, Plus, Minus, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, itemsPrice, totalAmount, shippingPrice } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-kenzna-cream">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-kenzna-amber" />
              <h3 className="font-bold text-stone-800 text-lg">سلة التسوق</h3>
              <span className="text-xs bg-kenzna-amber text-white font-bold px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 mx-auto bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                  <ShoppingBag size={36} />
                </div>
                <h4 className="font-bold text-stone-700 text-lg">سلتك فارغة 🛒</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  استكشف كنوزنا الطبيعية من المكسرات والفواكه الجافة وأضف ما يعجبك.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/products');
                  }}
                  className="inline-flex items-center gap-2 bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-all"
                >
                  <span>ابدأ التسوق الآن</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.product}-${item.weight}`}
                  className="flex gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-100 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-200"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="pr-1">
                      <h5 className="text-xs font-bold text-stone-800 line-clamp-1">
                        {item.name}
                      </h5>
                      <span className="text-[11px] font-semibold text-kenzna-amber bg-kenzna-amber-light px-2 py-0.5 rounded-md inline-block mt-1">
                        الوزن: {item.weight}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product, item.weight, item.quantity - 1)}
                          className="px-2 py-1 text-stone-500 hover:bg-stone-100"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product, item.weight, item.quantity + 1)}
                          className="px-2 py-1 text-stone-500 hover:bg-stone-100"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-stone-900 font-mono">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product, item.weight)}
                    className="text-stone-400 hover:text-rose-500 p-1 self-start"
                    title="حذف"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-stone-100 bg-stone-50/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-stone-900 font-mono">{formatPrice(itemsPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>التوصيل:</span>
                <span className="font-bold text-stone-900 font-mono">
                  {shippingPrice === 0 ? (
                    <span className="text-emerald-600 font-bold">مجاني 🎉</span>
                  ) : (
                    formatPrice(shippingPrice)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>المجموع الكلي:</span>
                <span className="text-lg text-kenzna-amber font-mono">{formatPrice(totalAmount)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="text-center py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors"
                >
                  عرض السلة
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                  className="text-center py-2.5 rounded-xl bg-kenzna-amber hover:bg-kenzna-amber-hover text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>إتمام الطلب</span>
                  <ArrowLeft size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
