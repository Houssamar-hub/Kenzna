import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Truck,
  HeartPulse,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  Wheat,
  Star,
  Plus,
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/products/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { formatPrice } from '../utils/formatters';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [popularCategoryFilter, setPopularCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Circular Feature Categories data with direct high quality imagery
  const circularCategories = [
    {
      name: 'تمر المجهول',
      english: 'Dates',
      slug: 'dried-fruits',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'اللوز البلدي',
      english: 'Almonds',
      slug: 'nuts',
      image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'البندق الفاخر',
      english: 'Hazelnuts',
      slug: 'nuts',
      image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'البرقوق المجفف',
      english: 'Prunes',
      slug: 'dried-fruits',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'البذور والحبوب',
      english: 'Seeds',
      slug: 'seeds',
      image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'التين المجفف',
      english: 'Dry Figs',
      slug: 'dried-fruits',
      image: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=400&auto=format&fit=crop&q=80',
    },
  ];

  // Quick selector thumbnails
  const quickThumbnails = [
    {
      name: 'خلطات مكسرات',
      image: 'https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=200&auto=format&fit=crop&q=80',
      slug: 'mixes',
    },
    {
      name: 'مكسرات مشكلة',
      image: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=200&auto=format&fit=crop&q=80',
      slug: 'nuts',
    },
    {
      name: 'فواكه مجففة',
      image: 'https://images.unsplash.com/photo-1596040033282-59e55a7bca5e?w=200&auto=format&fit=crop&q=80',
      slug: 'dried-fruits',
    },
    {
      name: 'عسل طبيعي',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80',
      slug: 'honeyed',
    },
    {
      name: 'بذور طبيعية',
      image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=200&auto=format&fit=crop&q=80',
      slug: 'seeds',
    },
    {
      name: 'باقات وهدايا',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&auto=format&fit=crop&q=80',
      slug: 'packs',
    },
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=30'),
        ]);

        setCategories(catRes.data);
        const products = prodRes.data.products || [];
        setAllProducts(products);
        setBestSellers(products.filter((p) => p.bestSeller));
        setNewArrivals(products.filter((p) => p.isNewArrival || p.bestSeller).slice(0, 4));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const displayedPopularProducts =
    popularCategoryFilter === 'all'
      ? bestSellers.slice(0, 8)
      : allProducts.filter((p) => p.category?.slug === popularCategoryFilter).slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-kenzna-cream">
      {/* 1. Hero Section (Restored Previous Layout) */}
      <section className="relative overflow-hidden bg-[#F5F6F3] py-12 lg:py-20 border-b border-stone-200/40">
        {/* Subtle decorative doodle curves */}
        <div className="absolute top-6 right-8 text-kenzna-green/40 pointer-events-none hidden sm:block">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M10 80 Q 50 10, 90 40 T 70 90" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (Right in RTL) */}
            <div className="lg:col-span-6 space-y-6 text-right">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 font-tajawal tracking-tight leading-[1.2]">
                تناول الفواكه الجافة والمكسرات واستمتع بصحة وحيوية.
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-lg leading-relaxed font-medium">
                ننتقي لك أجود أنواع المكسرات المحمصة، الفواكه الجافة، والخلطات الطبيعية بعناية واحترافية لتصلك طازجة أينما كنت بالمغرب.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3.5 pt-2">
                <Link
                  to="/products"
                  className="bg-kenzna-green hover:bg-kenzna-green-dark text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>تسوق الآن</span>
                  <ArrowLeft size={16} />
                </Link>

                <Link
                  to="/about"
                  className="bg-kenzna-amber hover:bg-kenzna-amber-hover text-stone-900 font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-sm transition-all hover:scale-105"
                >
                  اكتشف المزيد
                </Link>
              </div>
            </div>

            {/* Right: Vertical Bowls Composition */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative max-w-md lg:max-w-none w-full">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="/hero-nuts.jpg"
                    alt="تشكيلة مكسرات كنزنا الفاخرة"
                    className="w-full h-96 sm:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-5 inset-x-5 text-white text-right">
                    <span className="bg-kenzna-amber text-stone-900 text-[11px] font-black px-3 py-1 rounded-full uppercase shadow-sm">
                      طبيعي وطازج 100% 🌿
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-tajawal mt-2">
                      مزيج منتقى بعناية من أفضل المزارع والواحات
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Categories (Circular Dishes Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-tajawal">
            التصنيفات المميزة
          </h2>
          <p className="text-xs text-stone-400 font-mono">Feature Categories</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
          {circularCategories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center space-y-2.5 transition-transform hover:-translate-y-1"
            >
              {/* Circular Bowl Container */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-card group-hover:shadow-premium group-hover:border-kenzna-green transition-all duration-300 bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Label */}
              <div className="text-center">
                <span className="block font-bold text-xs sm:text-sm text-stone-800 group-hover:text-kenzna-green-dark transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">{cat.english}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2.5 Signature Flavored Nuts Showcase (المكسرات المنكهة الفاخرة) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="text-right">
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full inline-block mb-1">
              نكهات حصرية لا تُقاوم 🌶️🧀🍯
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-tajawal">
              تشكيلة المكسرات المنكهة (Flavored Nuts)
            </h2>
          </div>

          <Link
            to="/products?category=nuts"
            className="text-xs font-bold text-kenzna-green-dark hover:underline flex items-center gap-1"
          >
            <span>عرض جميع النكهات</span>
            <ArrowLeft size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {allProducts.filter(p => p.images?.[0]?.startsWith('/flavors/')).map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* 3. Most Popular Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-tajawal">
            المنتجات الأكثر شعبية
          </h2>
          <p className="text-xs text-stone-400 font-mono">Most Popular Product</p>
        </div>

        {/* Quick Thumbnails Selector Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setPopularCategoryFilter('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              popularCategoryFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            جميع المنتجات
          </button>
          {quickThumbnails.map((item, i) => (
            <button
              key={i}
              onClick={() => setPopularCategoryFilter(item.slug)}
              className={`flex items-center gap-2 p-1.5 pl-3 rounded-2xl border transition-all text-xs font-bold ${
                popularCategoryFilter === item.slug
                  ? 'bg-kenzna-green-soft border-kenzna-green text-kenzna-green-deep shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              <img
                src={item.image}
                alt=""
                className="w-8 h-8 rounded-xl object-cover"
              />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? [1, 2, 3, 4, 5, 6, 7, 8].map((n) => <SkeletonCard key={n} />)
            : displayedPopularProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
        </div>
      </section>

      {/* 4. Why Choose Us Section (Matching reference split layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-stone-200/70 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Boutique/Shop Store photo */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-stone-100 relative">
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80"
              alt="متجر كنزنا للفواكه الجافة"
              className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Right: Why Choose Us Content with 3 Green Bullet Points */}
          <div className="lg:col-span-6 space-y-6 text-right">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-tajawal">
                لماذا تختار كنزنا؟
              </h2>
              <p className="text-xs text-stone-400 font-mono mt-0.5">Why Choose Us</p>
            </div>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-kenzna-green-soft border border-kenzna-green/30 text-kenzna-green-dark flex items-center justify-center shrink-0 mt-1">
                  <Truck size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">توصيل سريع ومجاني للباب (Free Home Delivery)</h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    نصل إليك في جميع مدن المغرب مع خدمة التوصيل السريع والدفع نقداً عند استلام ومعاينة طلبك.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-kenzna-green-soft border border-kenzna-green/30 text-kenzna-green-dark flex items-center justify-center shrink-0 mt-1">
                  <HeartPulse size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">طبيعي 100% لصحتك وحيويتك (For Your Health)</h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    منتجات طبيعية نقية خالية تماماً من الإضافات الكيميائية والزيوت المهدرجة، غنية بالفيتامينات والمعادن.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-kenzna-green-soft border border-kenzna-green/30 text-kenzna-green-dark flex items-center justify-center shrink-0 mt-1">
                  <Award size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">جودة ممتازة نخب أول (100% Premium Quality)</h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    تعبئة صحية محكمة الإغلاق تحافظ على قرمشة ونكهة المكسرات والفواكه الطازجة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Premium Quality Product Cards (Saffron, Honey, etc.) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-tajawal">
            منتجات الجودة الفاخرة
          </h2>
          <p className="text-xs text-stone-400 font-mono">Premium Quality Product</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Mixes */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft group flex flex-col justify-between">
            <div className="h-48 overflow-hidden bg-stone-100 relative">
              <img
                src="https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&auto=format&fit=crop&q=80"
                alt="Mixed Item"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Mix كنزنا الملكي الفاخر</h4>
                <span className="text-xs text-stone-400 font-mono">Assorted Royal Nuts</span>
              </div>
              <span className="font-black text-sm font-mono text-kenzna-green-deep">65 د.م.</span>
            </div>
          </div>

          {/* Card 2: Saffron */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft group flex flex-col justify-between">
            <div className="h-48 overflow-hidden bg-stone-100 relative">
              <img
                src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80"
                alt="Saffron"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">بندق محمص مقشر</h4>
                <span className="text-xs text-stone-400 font-mono">Roasted Hazelnuts</span>
              </div>
              <span className="font-black text-sm font-mono text-kenzna-green-deep">55 د.م.</span>
            </div>
          </div>

          {/* Card 3: Honeyed Almonds */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft group flex flex-col justify-between">
            <div className="h-48 overflow-hidden bg-stone-100 relative">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
                alt="Bee Honey"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">لوز معسل بالعسل والسمسم</h4>
                <span className="text-xs text-stone-400 font-mono">Honeyed Almonds</span>
              </div>
              <span className="font-black text-sm font-mono text-kenzna-green-deep">55 د.م.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrival Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-tajawal">
              وصل حديثاً
            </h2>
            <p className="text-xs text-stone-400 font-mono">New Arrival</p>
          </div>

          <Link
            to="/products?isNewArrival=true"
            className="w-10 h-10 rounded-full bg-kenzna-amber hover:bg-kenzna-amber-hover text-stone-900 flex items-center justify-center transition-transform hover:scale-110"
            title="عرض الكل"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
