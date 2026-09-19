import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';

const ProductFilter = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-soft space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-900 font-bold">
          <Filter size={18} className="text-kenzna-amber" />
          <span>تصفية المنتجات</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={13} />
          <span>إعادة ضبط</span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider">
          التصنيفات
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-right px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
              selectedCategory === 'all'
                ? 'bg-kenzna-amber text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>جميع المنتجات</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelectCategory(cat.slug || cat._id)}
              className={`w-full text-right px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                selectedCategory === cat.slug || selectedCategory === cat._id
                  ? 'bg-kenzna-amber text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{cat.name}</span>
              {cat.itemCount !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat.slug || selectedCategory === cat._id
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {cat.itemCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-3 pt-4 border-t border-stone-100">
        <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider">
          ترتيب حسب
        </h4>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-kenzna-amber cursor-pointer"
        >
          <option value="newest">الأحدث وصولاً</option>
          <option value="bestseller">الأكثر طلباً ومبيعاً</option>
          <option value="price-asc">السعر: من الأقل للأعلى</option>
          <option value="price-desc">السعر: من الأعلى للأقل</option>
          <option value="rating">الأعلى تقييماً</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span>أقصى سعر:</span>
          <span className="text-kenzna-amber font-mono">{priceRange} درهم</span>
        </div>
        <input
          type="range"
          min="15"
          max="600"
          step="5"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-kenzna-amber cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
          <span>15 د.م.</span>
          <span>600 د.م.</span>
        </div>
      </div>

      {/* Checkbox Specials */}
      <div className="space-y-2.5 pt-4 border-t border-stone-100">
        <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider">
          خيارات خاصة
        </h4>
        
        <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => onFilterChange('featured', e.target.checked)}
            className="rounded border-stone-300 text-kenzna-amber focus:ring-kenzna-amber w-4 h-4"
          />
          <span>منتجات مميزة فقط ⭐</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.bestSeller}
            onChange={(e) => onFilterChange('bestSeller', e.target.checked)}
            className="rounded border-stone-300 text-kenzna-amber focus:ring-kenzna-amber w-4 h-4"
          />
          <span>الأكثر مبيعاً 🔥</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.isNewArrival}
            onChange={(e) => onFilterChange('isNewArrival', e.target.checked)}
            className="rounded border-stone-300 text-kenzna-amber focus:ring-kenzna-amber w-4 h-4"
          />
          <span>وصل حديثاً ✨</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilter;
