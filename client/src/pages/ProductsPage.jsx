import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Search, X, Sparkles, SlidersHorizontal, PackageOpen } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import SkeletonCard from '../components/common/SkeletonCard';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state from URL or defaults
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const priceRange = Number(searchParams.get('maxPrice')) || 600;
  const featured = searchParams.get('featured') === 'true';
  const bestSeller = searchParams.get('bestSeller') === 'true';
  const isNewArrival = searchParams.get('isNewArrival') === 'true';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (keyword) params.append('keyword', keyword);
        if (category && category !== 'all') params.append('category', category);
        if (sortBy) params.append('sortBy', sortBy);
        if (priceRange && priceRange < 600) params.append('maxPrice', priceRange);
        if (featured) params.append('featured', 'true');
        if (bestSeller) params.append('bestSeller', 'true');
        if (isNewArrival) params.append('isNewArrival', 'true');

        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, sortBy, priceRange, featured, bestSeller, isNewArrival]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'all' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-kenzna-beige via-kenzna-cream to-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 text-right">
          <span className="text-xs font-bold text-kenzna-amber bg-kenzna-amber-light px-3 py-1 rounded-full">
            كتالوج كنزنا
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-kenzna-brown font-tajawal">
            جميع منتجات كنزنا الطبيعية
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
            تصفح تشكيلتنا الشاملة من المكسرات، الفواكه الجافة، البذور الطبيعية، الخلطات الصحية والباقات الملكية.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex items-center justify-center gap-2 bg-kenzna-amber text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-md"
        >
          <SlidersHorizontal size={16} />
          <span>تصفية وترتيب المنتجات</span>
        </button>
      </div>

      {/* Active Filter Tags */}
      {(keyword || (category && category !== 'all') || featured || bestSeller || isNewArrival || priceRange < 600) && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-stone-500">الفلاتر المطبقة:</span>

          {keyword && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-stone-200 text-xs font-semibold px-3 py-1 rounded-full text-stone-800">
              <span>البحث: "{keyword}"</span>
              <button onClick={() => updateParam('keyword', '')} className="text-stone-400 hover:text-rose-500">
                <X size={13} />
              </button>
            </span>
          )}

          {category && category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-stone-200 text-xs font-semibold px-3 py-1 rounded-full text-stone-800">
              <span>التصنيف: {categories.find(c => c.slug === category || c._id === category)?.name || category}</span>
              <button onClick={() => updateParam('category', 'all')} className="text-stone-400 hover:text-rose-500">
                <X size={13} />
              </button>
            </span>
          )}

          {priceRange < 600 && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-stone-200 text-xs font-semibold px-3 py-1 rounded-full text-stone-800">
              <span>السعر حتى: {priceRange} درهم</span>
              <button onClick={() => updateParam('maxPrice', null)} className="text-stone-400 hover:text-rose-500">
                <X size={13} />
              </button>
            </span>
          )}

          {featured && (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full text-amber-800">
              <span>مميز ⭐</span>
              <button onClick={() => updateParam('featured', false)} className="text-amber-600 hover:text-rose-500">
                <X size={13} />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 font-bold hover:underline px-2"
          >
            مسح الكل
          </button>
        </div>
      )}

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28">
          <ProductFilter
            categories={categories}
            selectedCategory={category}
            onSelectCategory={(val) => updateParam('category', val)}
            priceRange={priceRange}
            onPriceChange={(val) => updateParam('maxPrice', val)}
            sortBy={sortBy}
            onSortChange={(val) => updateParam('sortBy', val)}
            filters={{ featured, bestSeller, isNewArrival }}
            onFilterChange={(key, val) => updateParam(key, val)}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto bg-stone-900/50 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
                <h3 className="font-bold text-stone-800 text-base">تصفية المنتجات</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X size={20} />
                </button>
              </div>
              <ProductFilter
                categories={categories}
                selectedCategory={category}
                onSelectCategory={(val) => {
                  updateParam('category', val);
                  setMobileFilterOpen(false);
                }}
                priceRange={priceRange}
                onPriceChange={(val) => updateParam('maxPrice', val)}
                sortBy={sortBy}
                onSortChange={(val) => updateParam('sortBy', val)}
                filters={{ featured, bestSeller, isNewArrival }}
                onFilterChange={(key, val) => updateParam(key, val)}
                onReset={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <main className="lg:col-span-3 space-y-6">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
            <span>تم العثور على <strong className="text-stone-900 font-bold">{products.length}</strong> منتج</span>
            <span className="hidden sm:inline">أصناف طبيعية 100% مختارة بعناية</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-4 shadow-soft">
              <div className="w-20 h-20 mx-auto bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                <PackageOpen size={36} />
              </div>
              <h3 className="text-lg font-bold text-stone-800">
                لم نجد أي منتجات مطابقة لبحثك.
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                جرب تغيير خيارات التصفية أو البحث عن كلمة مفتاحية أخرى كالـ "لوز"، "تمر"، أو "كاجو".
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs font-bold px-6 py-3 rounded-full shadow-sm transition-all"
              >
                إعادة ضبط جميع الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
