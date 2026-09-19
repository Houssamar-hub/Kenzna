import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  Sparkles,
  Download,
  FileText,
} from 'lucide-react';
import api from '../../services/api';
import { formatPrice, formatDate, orderStatusMap } from '../../utils/formatters';
import { downloadSalesReportPDF, downloadOrderInvoicePDF } from '../../utils/pdfGenerator';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-12 h-12 mx-auto border-4 border-kenzna-amber border-t-transparent rounded-full animate-spin"></div>
        <p className="text-stone-500 font-semibold">جاري تحميل إحصائيات المتجر والتقارير...</p>
      </div>
    );
  }

  const { kpis, statusCounts, monthlySales, lowStockProducts, recentOrders } = stats;

  return (
    <div className="space-y-8 text-right">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 font-tajawal">
            لوحة الإحصائيات العامة
          </h1>
          <p className="text-xs text-stone-500">
            متابعة شاملة للمبيعات، الطلبات، حركة المخزون، ونشاط الزبناء في كنزنا
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadSalesReportPDF(recentOrders, stats)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Download size={15} />
            <span>تحميل تقرير المبيعات (PDF) 📊</span>
          </button>

          <Link
            to="/admin/products"
            className="bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>+ إضافة منتج</span>
          </Link>
        </div>
      </div>

      {/* 1. KPI Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Total Sales */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">إجمالي المبيعات</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-kenzna-amber flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 font-mono">
            {formatPrice(kpis.totalSales)}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp size={12} />
            <span>طلب مؤكد ومسلم</span>
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">عدد الطلبات</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 font-mono">
            {kpis.totalOrders}
          </p>
          <span className="text-[11px] text-stone-400">
            {statusCounts.Pending || 0} طلب في الانتظار
          </span>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">الزبناء المسجلون</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 font-mono">
            {kpis.totalUsers}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold">حسابات نشطة</span>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">إجمالي الأصناف</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 font-mono">
            {kpis.totalProducts}
          </p>
          <span className="text-[11px] text-stone-400">في جميع التصنيفات</span>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600">تنبيه المخزون</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 font-mono">
            {kpis.lowStockCount}
          </p>
          <span className="text-[11px] text-rose-500 font-bold">منتجات قاربت على النفاد</span>
        </div>
      </div>

      {/* 2. Monthly Sales Performance Chart & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-base text-stone-900">حركة المبيعات الشهرية</h3>
              <p className="text-xs text-stone-400">إحصائيات الأشهر الأخيرة بالدرهم المغربي</p>
            </div>
            <span className="text-xs bg-kenzna-amber-light text-kenzna-amber font-bold px-3 py-1 rounded-full">
              تحديث تلقائي
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {monthlySales.map((item, idx) => {
              const maxSales = Math.max(...monthlySales.map((m) => m.sales), 1000);
              const percentage = Math.round((item.sales / maxSales) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">{item.month} {item.year}</span>
                    <span className="font-mono font-bold text-kenzna-brown">
                      {formatPrice(item.sales)} ({item.orders} طلبات)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-kenzna-amber to-amber-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
          <h3 className="font-bold text-base text-stone-900 pb-3 border-b border-stone-100">
            حالة الطلبات الحالية
          </h3>

          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const meta = orderStatusMap[status] || orderStatusMap.Pending;
              return (
                <div
                  key={status}
                  className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`}></span>
                    <span className="text-xs font-bold text-stone-800">{meta.label}</span>
                  </div>
                  <span className="text-sm font-black text-stone-900 font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Recent Orders & Low Stock Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-base text-stone-900">أحدث الطلبات المستلمة</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-kenzna-amber hover:underline">
              عرض كل الطلبات
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="text-stone-400 bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4 rounded-r-xl">رقم الطلب</th>
                  <th className="py-3 px-4">الزبون</th>
                  <th className="py-3 px-4">المبلغ</th>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 rounded-l-xl">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((ord) => {
                  const meta = orderStatusMap[ord.orderStatus] || orderStatusMap.Pending;
                  return (
                    <tr key={ord._id} className="hover:bg-stone-50/80">
                      <td className="py-3.5 px-4 font-bold font-mono text-kenzna-brown">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 block">
                          {ord.customerInfo?.fullName || ord.user?.name}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {ord.customerInfo?.phone || ord.user?.phone}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 font-mono">
                        {formatDate(ord.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${meta.color}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => downloadOrderInvoicePDF(ord)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors inline-block"
                            title="تحميل الفاتورة PDF"
                          >
                            <FileText size={14} />
                          </button>
                          <Link
                            to="/admin/orders"
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-kenzna-amber hover:text-white transition-colors inline-block"
                            title="تفاصيل الطلب"
                          >
                            <Eye size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-base text-rose-700 flex items-center gap-1.5">
              <AlertTriangle size={18} />
              <span>مخزون حرج</span>
            </h3>
            <Link to="/admin/products" className="text-xs font-bold text-kenzna-amber hover:underline">
              تعديل المخزون
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">
                جميع المنتجات متوفرة بمخزون كافٍ ومريح ✅
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                    />
                    <span className="font-bold text-stone-800 line-clamp-1 max-w-[120px]">
                      {p.name}
                    </span>
                  </div>
                  <span className="bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded-lg font-mono">
                    باقي {p.stock} فقط
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
