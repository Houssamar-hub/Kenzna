import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('kenzna_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load favorites from user profile if logged in
  useEffect(() => {
    if (isAuthenticated && user?.favorites) {
      setFavorites(user.favorites);
      localStorage.setItem('kenzna_favorites', JSON.stringify(user.favorites));
    }
  }, [isAuthenticated, user]);

  const isFavorite = (productId) => {
    if (!productId) return false;
    const targetId = typeof productId === 'object' ? productId._id : productId;
    return favorites.some(fav => {
      const favId = typeof fav === 'object' ? fav._id : fav;
      return favId === targetId;
    });
  };

  const toggleFavorite = async (product) => {
    if (!product) return;
    const productId = product._id || product;
    const isCurrentlyFav = isFavorite(productId);

    if (isAuthenticated) {
      try {
        const { data } = await api.post(`/users/favorites/${productId}`);
        setFavorites(data.favorites || []);
        localStorage.setItem('kenzna_favorites', JSON.stringify(data.favorites || []));
        if (isCurrentlyFav) {
          toast.success('تمت إزالة المنتج من المفضلة');
        } else {
          toast.success('تمت إضافة المنتج إلى المفضلة ❤️');
        }
      } catch (error) {
        toast.error(error.message || 'فشل تحديث المفضلة');
      }
    } else {
      // Local storage guest favorites
      let updated;
      if (isCurrentlyFav) {
        updated = favorites.filter(fav => {
          const favId = typeof fav === 'object' ? fav._id : fav;
          return favId !== productId;
        });
        toast.success('تمت إزالة المنتج من المفضلة');
      } else {
        updated = [...favorites, product];
        toast.success('تمت إضافة المنتج إلى المفضلة ❤️');
      }
      setFavorites(updated);
      localStorage.setItem('kenzna_favorites', JSON.stringify(updated));
    }
  };

  const value = {
    favorites,
    isFavorite,
    toggleFavorite,
    favoritesCount: favorites.length,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
