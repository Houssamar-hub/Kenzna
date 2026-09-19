import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kenzna_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const savedCoupon = localStorage.getItem('kenzna_coupon');
      return savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch {
      return null;
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('kenzna_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync coupon to localStorage
  useEffect(() => {
    if (coupon) {
      localStorage.setItem('kenzna_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('kenzna_coupon');
    }
  }, [coupon]);

  // Add Item to Cart
  const addToCart = (product, selectedWeight = '250g', quantity = 1) => {
    // Find price for this specific weight
    let unitPrice = product.price;
    if (product.weights && product.weights.length > 0) {
      const wObj = product.weights.find(w => w.weight === selectedWeight);
      if (wObj) unitPrice = wObj.price;
    }

    setCartItems(prevItems => {
      const itemIndex = prevItems.findIndex(
        item => item.product === product._id && item.weight === selectedWeight
      );

      if (itemIndex > -1) {
        // Increment existing
        const newItems = [...prevItems];
        newItems[itemIndex].quantity += Number(quantity);
        toast.success(`تمت زيادة كمية "${product.name} (${selectedWeight})" في السلة 🛒`);
        return newItems;
      } else {
        // Add new
        const newItem = {
          product: product._id,
          name: product.name,
          slug: product.slug,
          image: product.images[0] || '',
          weight: selectedWeight,
          price: unitPrice,
          quantity: Number(quantity),
          stock: product.stock,
        };
        toast.success(`تمت إضافة "${product.name} (${selectedWeight})" إلى السلة بنجاح! ✨`);
        return [...prevItems, newItem];
      }
    });
  };

  // Remove Item
  const removeFromCart = (productId, weight) => {
    setCartItems(prev => prev.filter(item => !(item.product === productId && item.weight === weight)));
    toast.success('تم حذف المنتج من السلة');
  };

  // Update Quantity
  const updateQuantity = (productId, weight, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product === productId && item.weight === weight
          ? { ...item, quantity: Number(quantity) }
          : item
      )
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('kenzna_cart');
    localStorage.removeItem('kenzna_coupon');
  };

  // Calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const shippingPrice = cartItems.length === 0 ? 0 : (itemsPrice >= 300 ? 0 : 25);

  let discountAmount = 0;
  if (coupon && itemsPrice > 0) {
    if (coupon.discountType === 'percentage') {
      discountAmount = (itemsPrice * coupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(itemsPrice, coupon.discountValue);
    }
  }

  const totalAmount = Math.max(0, itemsPrice + shippingPrice - discountAmount);

  // Apply Coupon
  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      toast.error('يرجى إدخال رمز الكوبون');
      return;
    }
    try {
      const { data } = await api.post('/coupons/validate', {
        code: code.trim(),
        orderAmount: itemsPrice,
      });

      setCoupon(data);
      toast.success(data.message || 'تم تفعيل الكوبون بنجاح 🎉');
      return data;
    } catch (error) {
      toast.error(error.message || 'كوبون غير صالح');
      throw error;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.success('تم إزالة الكوبون');
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemsPrice,
    shippingPrice,
    discountAmount,
    totalAmount,
    totalItemsCount,
    coupon,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
