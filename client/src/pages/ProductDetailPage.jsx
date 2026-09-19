import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Sparkles,
  Leaf,
  Star,
  MessageSquarePlus,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/common/RatingStars';
import ProductCard from '../components/products/ProductCard';
import { formatPrice, formatDate } from '../utils/formatters';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Review form state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        if (data.weights && data.weights.length > 0) {
          setSelectedWeight(data.weights[0].weight);
        }

        // Fetch related products & reviews
        const [relatedRes, reviewsRes] = await Promise.all([
          api.get(`/products/${data._id}/related`).catch(() => ({ data: [] })),
          api.get(`/reviews/product/${data._id}`).catch(() => ({ data: [] })),
        ]);

        setRelatedProducts(relatedRes.data || []);
        setReviews(reviewsRes.data || []);
      } catch (err) {
        console.error('Failed to load product:', err);
        toast.error('تعذر العثور على المنتج المطلوب');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto border-4 border-kenzna-amber border-t-transparent rounded-full animate-spin"></div>
        <p className="text-stone-500 font-semibold">جاري تحميل تفاصيل المنتج الفاخر...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">عذراً، المنتج غير موجود</h2>
        <p className="text-sm text-stone-500">ربما تم نقله أو حذفه من الكتالوج.</p>
        <Link
          to="/products"
          className="inline-block bg-kenzna-amber text-white font-bold px-6 py-3 rounded-xl"
        >
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  // Active price based on chosen weight
  const activeWeightObj = product.weights?.find((w) => w.weight === selectedWeight);
  const currentPrice = activeWeightObj ? activeWeightObj.price : product.price;
  const currentOldPrice = activeWeightObj?.oldPrice || product.oldPrice;

  const isFav = isFavorite(product._id);

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('يرجى تسجيل الدخول أولاً لإضافة تقييمك');
      navigate('/login');
      return;
    }

    if (!commentInput.trim()) {
      toast.error('يرجى كتابة تعليقك');
      return;
    }

    try {
      setSubmittingReview(true);
      const { data: newReview } = await api.post('/reviews', {
        productId: product._id,
        rating: ratingInput,
        comment: commentInput.trim(),
      });

      setReviews([newReview, ...reviews]);
      setCommentInput('');
      toast.success('شكراً لمشاركتك تقييمك القيم! ⭐');
    } catch (err) {
      toast.error(err.message || 'فشل إرسال التقييم');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-kenzna-amber">الرئيسية</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-kenzna-amber">المنتجات</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-kenzna-amber">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-stone-900 font-bold truncate">{product.name}</span>
      </nav>

      {/* Main Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft relative group">
            <img
              src={product.images[activeImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.bestSeller && (
              <span className="absolute top-4 right-4 bg-kenzna-amber text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                الأكثر طلباً 🔥
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === idx
                      ? 'border-kenzna-amber ring-2 ring-kenzna-amber/30'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box & Info */}
        <div className="lg:col-span-6 space-y-6 text-right">
          <div>
            {/* Category & Origin Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-kenzna-beige text-kenzna-brown text-xs font-bold px-3 py-1 rounded-full">
                {product.category?.name || 'كنزنا'}
              </span>
              {product.origin && (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Leaf size={12} />
                  <span>المنشأ: {product.origin}</span>
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-kenzna-brown font-tajawal leading-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews Counter */}
            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={product.rating || 5} reviewsCount={reviews.length} size="md" />
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-medium">
                {product.stock > 0 ? (
                  <span className="text-emerald-600 font-bold">متوفر في المخزون ✅</span>
                ) : (
                  <span className="text-rose-500 font-bold">نفد من المخزون ❌</span>
                )}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-stone-50/90 rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-kenzna-brown font-mono">
                  {formatPrice(currentPrice * quantity)}
                </span>
                {currentOldPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono">
                    {formatPrice(currentOldPrice * quantity)}
                  </span>
                )}
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {formatPrice(currentPrice)} للوزن الواحد ({selectedWeight})
              </span>
            </div>

            {currentOldPrice && currentOldPrice > currentPrice && (
              <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full">
                وفر {Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Weight Selection */}
          {product.weights && product.weights.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                اختر الوزن المطلوب:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {product.weights.map((w) => (
                  <button
                    key={w.weight}
                    type="button"
                    onClick={() => setSelectedWeight(w.weight)}
                    className={`py-3 px-4 rounded-2xl border text-center transition-all ${
                      selectedWeight === w.weight
                        ? 'bg-kenzna-brown text-white border-kenzna-brown shadow-md'
                        : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="block font-black text-sm">{w.weight}</span>
                    <span
                      className={`block text-[11px] font-mono mt-0.5 ${
                        selectedWeight === w.weight ? 'text-kenzna-gold' : 'text-stone-500'
                      }`}
                    >
                      {formatPrice(w.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity Picker */}
              <div className="flex items-center border border-stone-300 rounded-2xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-stone-900 font-mono text-base">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                  product.stock <= 0
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-kenzna-amber hover:bg-kenzna-amber-hover text-white hover:shadow-lg hover:scale-[1.02] active:scale-95'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={20} />
                    <span>تمت الإضافة إلى السلة بنجاح!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    <span>أضف إلى السلة ({formatPrice(currentPrice * quantity)})</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleFavorite(product)}
                className={`p-4 rounded-2xl border transition-all ${
                  isFav
                    ? 'bg-rose-50 text-rose-500 border-rose-200'
                    : 'bg-white text-stone-500 border-stone-200 hover:text-rose-500 hover:border-rose-200'
                }`}
                title="إضافة للمفضلة"
              >
                <Heart size={22} className={isFav ? 'fill-rose-500' : ''} />
              </button>
            </div>
          </div>

          {/* Guarantees List */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-stone-700">
              <Truck size={18} className="text-kenzna-amber shrink-0" />
              <span>توصيل سريع لجميع مدن المغرب</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-700">
              <ShieldCheck size={18} className="text-kenzna-amber shrink-0" />
              <span>دفع عند الاستلام بعد المعاينة</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-700">
              <RotateCcw size={18} className="text-kenzna-amber shrink-0" />
              <span>ضمان استرجاع الجودة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Benefits & Nutrition */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-soft space-y-8">
        <div className="border-b border-stone-200 pb-4">
          <h3 className="text-xl font-bold text-kenzna-brown font-tajawal">
            الوصف والفوائد الغذائية
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-stone-800">عن هذا المنتج:</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {product.benefits && product.benefits.length > 0 && (
            <div className="space-y-4 bg-kenzna-cream/60 p-6 rounded-2xl border border-amber-900/10">
              <h4 className="font-bold text-sm text-kenzna-brown flex items-center gap-2">
                <Sparkles size={16} className="text-kenzna-amber" />
                <span>الفوائد الصحية الطبيعية:</span>
              </h4>
              <ul className="space-y-2.5">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                    <span className="text-kenzna-amber font-bold shrink-0">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-soft space-y-8">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="text-xl font-bold text-kenzna-brown font-tajawal">
              تقييمات وآراء الزبناء
            </h3>
            <span className="text-xs text-stone-500">({reviews.length} تقييم)</span>
          </div>
          <RatingStars rating={product.rating || 5} reviewsCount={reviews.length} size="md" />
        </div>

        {/* Add Review Form */}
        <form
          onSubmit={handleReviewSubmit}
          className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 space-y-4 text-right"
        >
          <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <MessageSquarePlus size={18} className="text-kenzna-amber" />
            <span>أضف تقييمك لهذا المنتج</span>
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 font-medium">اختر التقييم:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRatingInput(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    size={20}
                    className={star <= ratingInput ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="اكتب رأيك وتجربتك مع المنتج بكل أمانة..."
            rows={3}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="w-full bg-white border border-stone-200 text-stone-800 text-xs sm:text-sm rounded-xl p-3 focus:outline-none focus:border-kenzna-amber"
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="bg-kenzna-brown hover:bg-kenzna-brown-light text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
          >
            {submittingReview ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4 divide-y divide-stone-100">
          {reviews.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-6">
              كن أول من يكتب تقييماً لهذا المنتج الفاخر! ✨
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="pt-4 space-y-2 text-right">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">{rev.userName}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                      مشتري موثق ✅
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">{formatDate(rev.createdAt)}</span>
                </div>
                <RatingStars rating={rev.rating} showCount={false} size="xs" />
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-xl sm:text-2xl font-black text-kenzna-brown font-tajawal">
              منتجات مشابهة قد تعجبك
            </h3>
            <Link
              to={`/products?category=${product.category?.slug}`}
              className="text-xs font-bold text-kenzna-amber hover:underline"
            >
              عرض المزيد
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
