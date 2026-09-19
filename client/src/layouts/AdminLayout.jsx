import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  LogOut,
  Sparkles,
  Menu,
  X,
  Store,
  ChevronLeft,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, isAdmin, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-white">
        <p className="animate-pulse font-bold">جاري التحقق من صلاحيات الإدارة...</p>
      </div>
    );
  }

  // Route protection - ONLY admin allowed
  if (!user || !isAdmin) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  const menuItems = [
    { name: 'لوحة التحكم والإحصائيات', path: '/admin', icon: LayoutDashboard },
    { name: 'إدارة المنتجات', path: '/admin/products', icon: Package },
    { name: 'إدارة التصنيفات', path: '/admin/categories', icon: FolderTree },
    { name: 'إدارة الطلبات والمبيعات', path: '/admin/orders', icon: ShoppingBag },
    { name: 'إدارة المستخدمين', path: '/admin/users', icon: Users },
    { name: 'إدارة الكوبونات والخصومات', path: '/admin/coupons', icon: Tag },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-right">
      {/* Mobile Top bar */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-300"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-black text-sm text-kenzna-gold">لوحة تحكم كنزنا</span>
        </div>

        <Link
          to="/"
          className="text-xs text-stone-300 hover:text-white flex items-center gap-1"
        >
          <span>المتجر</span>
          <Store size={14} />
        </Link>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 right-0 z-40 h-screen w-72 bg-stone-900 text-white flex flex-col justify-between p-6 transition-transform duration-300 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Admin Brand */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-800">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kenzna-amber to-amber-600 flex items-center justify-center text-white font-bold shadow-md">
                <Sparkles size={20} className="text-kenzna-gold-light" />
              </div>
              <div>
                <span className="text-lg font-black font-tajawal text-white block">
                  كَنـْـزنَا <span className="text-kenzna-gold text-xs font-mono">ADMIN</span>
                </span>
                <span className="text-[10px] text-stone-400">لوحة الإدارة المركزية</span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-stone-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    active
                      ? 'bg-kenzna-amber text-white shadow-md'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-white' : 'text-stone-400'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Actions */}
        <div className="space-y-3 pt-6 border-t border-stone-800">
          <Link
            to="/"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-xs font-bold transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store size={16} className="text-kenzna-gold" />
              <span>الذهاب إلى المتجر</span>
            </div>
            <ChevronLeft size={14} className="text-stone-400" />
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="hidden md:flex items-center justify-between h-20 px-8 bg-white border-b border-stone-200 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>جلسة المدير المشفرة (Admin Role)</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-bold text-stone-600 hover:text-kenzna-amber flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              <Store size={15} />
              <span>معاينة واجهة المتجر</span>
            </Link>

            <div className="flex items-center gap-3 pr-4 border-r border-stone-200">
              <div className="w-9 h-9 rounded-full bg-kenzna-brown text-white font-bold flex items-center justify-center text-xs">
                {user.name?.charAt(0)}
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-stone-900 block">{user.name}</span>
                <span className="text-[10px] text-stone-400">{user.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Routed Sub-page */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
