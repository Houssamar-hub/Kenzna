import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, X, Check, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '10',
    minOrderAmount: '100',
    expiryDate: '2028-12-31',
    usageLimit: '500',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/coupons');
      setCoupons(data);
    } catch {
      toast.error('فشل تحميل الكوبونات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '10',
      minOrderAmount: '100',
      expiryDate: '2028-12-31',
      usageLimit: '500',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      minOrderAmount: String(c.minOrderAmount || 0),
      expiryDate: c.expiryDate ? c.expiryDate.substring(0, 10) : '2028-12-31',
      usageLimit: String(c.usageLimit || 1000),
      isActive: c.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount),
        expiryDate: new Date(formData.expiryDate),
        usageLimit: Number(formData.usageLimit),
        isActive: formData.isActive,
      };

      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon._id}`, payload);
        toast.success('تم تحديث الكوبون بنجاح ✅');
      } else {
        await api.post('/coupons', payload);
        toast.success('تم إنشاء الكوبون بنجاح 🎉');
      }

      setModalOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.message || 'فشل حفظ الكوبون');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`هل أنت متأكد من حذف الكوبون "${code}"؟`)) {
      try {
        await api.delete(`/coupons/${id}`);
        toast.success('تم حذف الكوبون بنجاح');
        fetchCoupons();
      } catch (err) {
        toast.error(err.message || 'فشل حذف الكوبون');
      }
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900 font-tajawal">
            إدارة الكوبونات والعروض ({coupons.length})
          </h1>
          <p className="text-xs text-stone-500">إنشاء رموز الخصم بنسب مئوية أو مبالغ ثابتة</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          <span>إنشاء كوبون جديد</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
              <tr>
                <th className="py-4 px-4">رمز الكوبون</th>
                <th className="py-4 px-4">نوع الخصم</th>
                <th className="py-4 px-4">قيمة الخصم</th>
                <th className="py-4 px-4">الحد الأدنى للطلب</th>
                <th className="py-4 px-4">تاريخ الانتهاء</th>
                <th className="py-4 px-4">مرات الاستخدام</th>
                <th className="py-4 px-4">الحالة</th>
                <th className="py-4 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-kenzna-brown text-sm">
                    <span className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-700 font-medium">
                    {c.discountType === 'percentage' ? 'نسبة مئوية (%)' : 'مبلغ ثابت (د.م.)'}
                  </td>
                  <td className="py-3.5 px-4 font-bold font-mono text-emerald-600">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `${c.discountValue} د.م.`}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-700">
                    {c.minOrderAmount ? `${c.minOrderAmount} د.م.` : 'بدون حد'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-500">
                    {formatDate(c.expiryDate)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-600">
                    {c.usedCount || 0} / {c.usageLimit || 1000}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {c.isActive ? 'مفعل' : 'معطل'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                        title="تعديل"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id, c.code)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-400"
                        title="حذف"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 text-right shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                {editingCoupon ? 'تعديل الكوبون' : 'إنشاء كوبون جديد'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">رمز الكوبون *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: KENZNA10"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono font-bold uppercase focus:outline-none focus:border-kenzna-amber"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نوع الخصم</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-kenzna-amber"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (درهم)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">قيمة الخصم *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الحد الأدنى للطلب</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-stone-300 text-kenzna-amber focus:ring-kenzna-amber w-4 h-4"
                  />
                  <span>الكوبون مفعل ونشط للزبناء</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-2.5 rounded-xl hover:bg-stone-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-kenzna-amber text-white text-xs font-bold py-2.5 rounded-xl hover:bg-kenzna-amber-hover"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ الكوبون'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;
