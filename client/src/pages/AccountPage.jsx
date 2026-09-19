import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ShoppingBag,
  FileText,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/products/ProductCard';
import { formatPrice, formatDate, orderStatusMap } from '../utils/formatters';
import { downloadOrderInvoicePDF } from '../utils/pdfGenerator';

const AccountPage = () => {
  const { user, logout, updateProfile, refreshUser, isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'profile';

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // New Address State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrTitle, setAddrTitle] = useState('المنزل');
  const [addrCity, setAddrCity] = useState('الدار البيضاء');
  const [addrDistrict, setAddrDistrict] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/account');
      return;
    }

    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user, isAuthenticated, navigate]);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          const { data } = await api.get('/orders/my-orders');
          setOrders(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const payload = { name, email, phone };
      if (password) payload.password = password;
      await updateProfile(payload);
      setPassword('');
    } catch {
      // Toast handled
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addrCity || !addrStreet || !addrPhone) {
      toast.error('يرجى تعبئة الحقول المطلوبة للعنوان');
      return;
    }
    try {
      setSavingAddress(true);
      await api.post('/users/addresses', {
        title: addrTitle,
        city: addrCity,
        district: addrDistrict,
        street: addrStreet,
        phone: addrPhone,
        isDefault: user?.addresses?.length === 0,
      });
      await refreshUser();
      toast.success('تمت إضافة العنوان بنجاح ✅');
      setShowAddressModal(false);
      setAddrStreet('');
      setAddrDistrict('');
    } catch (err) {
      toast.error(err.message || 'فشل حفظ العنوان');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await api.delete(`/users/addresses/${addressId}`);
      await refreshUser();
      toast.success('تم حذف العنوان');
    } catch (err) {
      toast.error(err.message || 'فشل حذف العنوان');
    }
  };

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Banner */}
      <div className="bg-gradient-to-r from-kenzna-brown via-kenzna-brown-light to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-right">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-kenzna-gold text-kenzna-brown flex items-center justify-center font-black text-2xl shadow-md">
            {user.name?.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-tajawal">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="bg-kenzna-gold text-kenzna-brown text-[10px] font-black px-2 py-0.5 rounded-full">
                  مدير النظام
                </span>
              )}
            </div>
            <p className="text-xs text-stone-300 font-mono">{user.email} • {user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              لوحة الإدارة (Admin)
            </Link>
          )}
          <button
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 bg-white rounded-3xl p-4 border border-stone-200/80 shadow-soft space-y-1.5">
          <button
            onClick={() => setTab('profile')}
            className={`w-full text-right px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'profile'
                ? 'bg-kenzna-amber text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <UserIcon size={18} />
            <span>معلوماتي الشخصية</span>
          </button>

          <button
            onClick={() => setTab('orders')}
            className={`w-full text-right px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
              activeTab === 'orders'
                ? 'bg-kenzna-amber text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={18} />
              <span>طلباتي السابقة</span>
            </div>
            {orders.length > 0 && (
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('addresses')}
            className={`w-full text-right px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'addresses'
                ? 'bg-kenzna-amber text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <MapPin size={18} />
            <span>عناويني المحفوظة</span>
          </button>

          <button
            onClick={() => setTab('favorites')}
            className={`w-full text-right px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
              activeTab === 'favorites'
                ? 'bg-kenzna-amber text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart size={18} />
              <span>قائمة المفضلة</span>
            </div>
            {favorites.length > 0 && (
              <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                {favorites.length}
              </span>
            )}
          </button>
        </aside>

        {/* Content Pane */}
        <main className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-soft">
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6 text-right">
              <h2 className="text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
                تعديل البيانات الشخصية
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber font-mono"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    كلمة المرور الجديدة (اتركها فارغة إن لم ترغب في التغيير)
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs font-bold px-6 py-3 rounded-xl shadow-sm transition-all"
                >
                  {savingProfile ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6 text-right">
              <h2 className="text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
                سجل الطلبات
              </h2>

              {loadingOrders ? (
                <p className="text-center py-10 text-xs text-stone-400">جاري تحميل الطلبات...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package size={40} className="mx-auto text-stone-300" />
                  <p className="text-sm font-bold text-stone-700">لا توجد طلبات سابقة بعد</p>
                  <Link
                    to="/products"
                    className="inline-block bg-kenzna-amber text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm"
                  >
                    تسوق الآن
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    const statusMeta = orderStatusMap[ord.orderStatus] || orderStatusMap.Pending;
                    return (
                      <div
                        key={ord._id}
                        className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                          <div>
                            <span className="text-xs text-stone-400">رقم الطلب:</span>
                            <span className="font-bold text-sm text-kenzna-brown font-mono mr-2">
                              {ord.orderNumber}
                            </span>
                            <span className="text-xs text-stone-400 font-mono mr-3">
                              • {formatDate(ord.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full border ${statusMeta.color}`}
                            >
                              {statusMeta.label}
                            </span>
                            <button
                              onClick={() => downloadOrderInvoicePDF(ord)}
                              className="bg-white hover:bg-stone-100 text-stone-700 hover:text-kenzna-amber border border-stone-200 text-xs font-bold px-3 py-1 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                              title="تحميل الفاتورة الرسمية PDF"
                            >
                              <FileText size={14} className="text-kenzna-amber" />
                              <span className="hidden sm:inline">تحميل الفاتورة PDF</span>
                            </button>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-stone-700">
                              <span>{it.name} ({it.weight}) × {it.quantity}</span>
                              <span className="font-mono font-bold">{formatPrice(it.price * it.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Total & Tracking Info */}
                        <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                          <span className="text-stone-500">
                            عنوان التوصيل: {ord.shippingAddress?.city} ({ord.shippingAddress?.address})
                          </span>
                          <span className="text-sm font-black text-kenzna-brown font-mono">
                            المجموع: {formatPrice(ord.totalAmount)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6 text-right">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-xl font-bold text-stone-900">عناوين التوصيل</h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>إضافة عنوان جديد</span>
                </button>
              </div>

              {user.addresses?.length === 0 ? (
                <div className="text-center py-10 text-xs text-stone-500">
                  لم تحفظ أي عنوان بعد. أضف عنوان منزلك أو عملك لتسهيل عملية الشراء القادمة.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses?.map((addr) => (
                    <div
                      key={addr._id}
                      className="bg-stone-50 p-5 rounded-2xl border border-stone-200 relative space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-stone-900">{addr.title}</span>
                        {addr.isDefault && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            العنوان الافتراضي
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600">
                        {addr.city} {addr.district ? `- ${addr.district}` : ''}
                      </p>
                      <p className="text-xs text-stone-600">{addr.street}</p>
                      <p className="text-xs text-stone-400 font-mono">الهاتف: {addr.phone}</p>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Trash2 size={13} />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Address Modal */}
              {showAddressModal && (
                <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-right">
                    <h3 className="text-base font-bold text-stone-900">إضافة عنوان جديد</h3>
                    <form onSubmit={handleAddAddress} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">اسم العنوان</label>
                        <input
                          type="text"
                          value={addrTitle}
                          onChange={(e) => setAddrTitle(e.target.value)}
                          placeholder="المنزل / العمل"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-kenzna-amber"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">المدينة</label>
                        <input
                          type="text"
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          placeholder="الدار البيضاء، الرباط..."
                          required
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-kenzna-amber"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">الشارع والتفاصيل</label>
                        <input
                          type="text"
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          placeholder="اسم الشارع ورقم المنزل"
                          required
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-kenzna-amber"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">رقم الهاتف للتوصيل</label>
                        <input
                          type="tel"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          placeholder="06XXXXXXXX"
                          required
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-kenzna-amber font-mono"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-2.5 rounded-xl hover:bg-stone-200"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          disabled={savingAddress}
                          className="flex-1 bg-kenzna-amber text-white text-xs font-bold py-2.5 rounded-xl hover:bg-kenzna-amber-hover"
                        >
                          {savingAddress ? 'جاري الحفظ...' : 'حفظ العنوان'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Favorites */}
          {activeTab === 'favorites' && (
            <div className="space-y-6 text-right">
              <h2 className="text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
                المنتجات المفضلة ({favorites.length})
              </h2>

              {favorites.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart size={40} className="mx-auto text-stone-300" />
                  <p className="text-sm font-bold text-stone-700">قائمة المفضلة فارغة</p>
                  <p className="text-xs text-stone-500">
                    اضغط على رمز القلب عند تصفح المنتجات لحفظ ما يعجبك هنا.
                  </p>
                  <Link
                    to="/products"
                    className="inline-block bg-kenzna-amber text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm"
                  >
                    استكشف المنتجات
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {favorites.map((prod) => (
                    <ProductCard key={prod._id || prod} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
