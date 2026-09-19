import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  LogOut,
  Package,
  Phone,
  Wheat,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';

const Navbar = ({ onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({ slug: 'all', name: 'جميع التصنيفات' });
  const [categories, setCategories] = useState([]);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount, totalAmount } = useCart();
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('keyword', searchQuery.trim());
    if (selectedCategory.slug !== 'all') params.append('category', selectedCategory.slug);
    navigate(`/products?${params.toString()}`);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'من نحن', path: '/about' },
    { name: 'المتجر', path: '/products' },
    { name: 'العروض المميزة', path: '/products?featured=true' },
    { name: 'التصنيفات', path: '/products#categories' },
    { name: 'اتصل بنا', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.search;
    return location.pathname + location.search === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-stone-100 transition-all">
      {/* 1. Main Search & Logo Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-kenzna-amber flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Wheat size={22} className="text-white" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 font-tajawal flex items-center gap-1">
                كَنـْـزنَا <span className="text-kenzna-green-dark text-sm font-bold font-mono">KENZNA</span>
              </span>
              <span className="text-[10px] -mt-1 font-medium text-stone-400">
                كنز من الطبيعة إلى بابك
              </span>
            </div>
          </Link>

          {/* Center: Search Bar with Category Dropdown */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl relative items-center border-2 border-stone-200 hover:border-kenzna-green focus-within:border-kenzna-green rounded-full bg-stone-50 overflow-visible transition-colors"
          >
            {/* Category Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-100/90 text-stone-700 hover:text-stone-900 text-xs font-bold rounded-r-full border-l border-stone-200 shrink-0 h-10 transition-colors"
              >
                <span className="max-w-[110px] truncate">{selectedCategory.name}</span>
                <ChevronDown size={14} className="text-stone-400" />
              </button>

              {/* Category Dropdown List */}
              {categoryDropdownOpen && (
                <div
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                  className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-premium border border-stone-100 py-2 z-50 text-right animate-in fade-in"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory({ slug: 'all', name: 'جميع التصنيفات' });
                      setCategoryDropdownOpen(false);
                    }}
                    className="w-full text-right px-4 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50"
                  >
                    جميع التصنيفات
                  </button>
                  {categories.map((c) => (
                    <button
                      type="button"
                      key={c._id}
                      onClick={() => {
                        setSelectedCategory({ slug: c.slug, name: c.name });
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-kenzna-green-dark"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="ابحث عن الفواكه الجافة، المكسرات، الخلطات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-stone-800 text-xs sm:text-sm px-4 py-2 focus:outline-none placeholder:text-stone-400"
            />

            {/* Search Submit Button */}
            <button
              type="submit"
              className="p-2.5 text-stone-400 hover:text-kenzna-green-dark pl-4 transition-colors"
              aria-label="بحث"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Right Action Icons: Favorites, Cart Pill, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Favorites Icon Button */}
            <Link
              to="/account?tab=favorites"
              className="relative p-2.5 text-stone-600 hover:text-kenzna-green-dark hover:bg-stone-100 rounded-full transition-colors"
              aria-label="المفضلة"
            >
              <Heart size={20} />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart Pill with Price & Count */}
            <button
              onClick={onOpenCart || (() => navigate('/cart'))}
              className="flex items-center gap-2.5 bg-kenzna-green-soft border border-kenzna-green/30 hover:border-kenzna-green px-3.5 py-1.5 rounded-full transition-all text-xs font-bold text-kenzna-green-deep group"
            >
              <div className="w-7 h-7 rounded-full bg-kenzna-green text-white flex items-center justify-center relative shadow-xs">
                <ShoppingBag size={14} />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-kenzna-amber text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-stone-400 font-normal">السلة ({totalItemsCount})</span>
                <span className="text-xs font-mono font-bold text-stone-900">{formatPrice(totalAmount)}</span>
              </div>
            </button>

            {/* User Account / Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-stone-800 text-white flex items-center justify-center text-[11px]">
                      {user?.name?.charAt(0)}
                    </div>
                    <span className="hidden sm:inline max-w-[80px] truncate">{user?.name}</span>
                    <ChevronDown size={13} className="text-stone-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-premium border border-stone-100 py-2 z-50 text-right animate-in fade-in"
                    >
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs text-stone-400">مرحباً بك</p>
                        <p className="text-sm font-bold text-stone-800 truncate">{user?.name}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50"
                        >
                          <ShieldAlert size={15} />
                          <span>لوحة الإدارة (Admin)</span>
                        </Link>
                      )}

                      <Link
                        to="/account?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 font-medium"
                      >
                        <Package size={15} />
                        <span>طلباتي السابقة</span>
                      </Link>

                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 font-medium"
                      >
                        <UserIcon size={15} />
                        <span>إعدادات حسابي</span>
                      </Link>

                      <div className="border-t border-stone-100 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-right flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold"
                      >
                        <LogOut size={15} />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-stone-700 hover:text-kenzna-green-dark px-2.5 py-1.5 transition-colors"
                  >
                    دخول
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 rounded-full shadow-xs transition-all"
                  >
                    حساب جديد
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-kenzna-green-dark rounded-xl"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Secondary Navigation Links & Call Center Bar */}
      <div className="hidden md:block bg-stone-50 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Nav links */}
            <nav className="flex items-center gap-8 text-xs font-bold text-stone-700">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors hover:text-kenzna-green-dark py-1 ${
                    isActive(link.path) ? 'text-kenzna-green-dark font-black' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Call Center Pill */}
            <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
              <Phone size={14} className="text-kenzna-green" />
              <span>اتصل للطلب السريع:</span>
              <span dir="ltr" className="font-mono font-bold text-stone-900 hover:text-kenzna-green transition-colors">
                +212 661-000000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-stone-900/40 backdrop-blur-sm z-50 flex flex-col justify-start">
          <div className="bg-white border-b border-stone-200 p-6 space-y-4 animate-in slide-in-from-top duration-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-100 text-stone-800 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-stone-200 focus:outline-none focus:border-kenzna-green"
              />
              <button
                type="submit"
                className="absolute left-3 top-2.5 text-stone-400 hover:text-kenzna-green"
              >
                <Search size={16} />
              </button>
            </form>

            <div className="flex flex-col space-y-2 font-bold text-stone-700 text-xs">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors ${
                    isActive(link.path) ? 'bg-kenzna-green-soft text-kenzna-green-dark font-black' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {!isAuthenticated && (
              <div className="pt-3 border-t border-stone-100 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl border border-stone-300 text-stone-800 font-bold text-xs"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-kenzna-green text-white font-bold text-xs shadow-xs"
                >
                  حساب جديد
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
