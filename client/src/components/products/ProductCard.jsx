import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Check, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import RatingStars from '../common/RatingStars';
import { formatPrice } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedWeight, setSelectedWeight] = useState(
    product.weights && product.weights.length > 0 ? product.weights[0].weight : '250g'
  );
  const [isAdded, setIsAdded] = useState(false);

  // Active price for weight
  const activeWeightObj = product.weights?.find((w) => w.weight === selectedWeight);
  const currentPrice = activeWeightObj ? activeWeightObj.price : product.price;
  const currentOldPrice = activeWeightObj?.oldPrice || product.oldPrice;

  const isFav = isFavorite(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-100/90 hover:border-kenzna-green/40 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between p-4 group text-right relative">
      {/* Top Badges & Favorite */}
      <div className="flex items-center justify-between mb-2">
        <div>
          {product.bestSeller && (
            <span className="bg-kenzna-amber text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              الأكثر طلباً
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-kenzna-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              جديد
            </span>
          )}
        </div>

        <button
          onClick={handleFavoriteClick}
          aria-label="المفضلة"
          className={`p-2 rounded-full transition-colors ${
            isFav
              ? 'bg-rose-50 text-rose-500'
              : 'text-stone-300 hover:text-rose-500 hover:bg-stone-50'
          }`}
        >
          <Heart size={16} className={isFav ? 'fill-rose-500' : ''} />
        </button>
      </div>

      {/* Product Image Container */}
      <Link
        to={`/products/${product._id}`}
        className="block relative aspect-square rounded-2xl overflow-hidden bg-stone-50 mb-3"
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Product Info */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <Link
            to={`/products/${product._id}`}
            className="font-bold text-xs sm:text-sm text-stone-900 hover:text-kenzna-green-dark line-clamp-1 transition-colors block"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Weight Variant Mini Selector */}
          {product.weights && product.weights.length > 0 && (
            <div className="flex items-center gap-1 my-1.5">
              {product.weights.map((w) => (
                <button
                  key={w.weight}
                  type="button"
                  onClick={() => setSelectedWeight(w.weight)}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border transition-all ${
                    selectedWeight === w.weight
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {w.weight}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-kenzna-green-deep font-mono">
                {formatPrice(currentPrice)}
              </span>
              {currentOldPrice && (
                <span className="text-[11px] text-stone-400 line-through font-mono">
                  {formatPrice(currentOldPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400">/{selectedWeight}</span>
          </div>

          {/* Circular Green Plus Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xs ${
              product.stock <= 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : isAdded
                ? 'bg-kenzna-green-dark text-white scale-105'
                : 'bg-kenzna-green hover:bg-kenzna-green-dark text-white hover:scale-110 active:scale-95'
            }`}
            title="أضف إلى السلة"
          >
            {isAdded ? <Check size={16} /> : <Plus size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
