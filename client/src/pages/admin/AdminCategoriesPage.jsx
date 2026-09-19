import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800',
    icon: 'Nut',
  });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch {
      toast.error('فشل تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800',
      icon: 'Nut',
    });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image,
      icon: cat.icon || 'Nut',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingCat) {
        await api.put(`/categories/${editingCat._id}`, formData);
        toast.success('تم تحديث التصنيف بنجاح ✅');
      } else {
        await api.post('/categories', formData);
        toast.success('تمت إضافة التصنيف بنجاح 🎉');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'فشل حفظ التصنيف');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف تصنيف "${name}"؟`)) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('تم حذف التصنيف بنجاح');
        fetchCategories();
      } catch (err) {
        toast.error(err.message || 'فشل حذف التصنيف');
      }
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900 font-tajawal">
            إدارة التصنيفات ({categories.length})
          </h1>
          <p className="text-xs text-stone-500">إضافة وتعديل تصنيفات المتجر الأساسية وصورها</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          <span>إضافة تصنيف جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden flex flex-col justify-between"
          >
            <div className="h-36 relative overflow-hidden bg-stone-100">
              <img src={cat.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm">
                {cat.itemCount || 0} منتجات
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">{cat.name}</h3>
                <span className="text-[11px] font-mono text-stone-400 block mb-1">/{cat.slug}</span>
                <p className="text-xs text-stone-500 line-clamp-2">{cat.description}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-2 rounded-xl text-stone-600 hover:text-kenzna-amber hover:bg-stone-100 transition-colors"
                  title="تعديل"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 text-right shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                {editingCat ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
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
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم التصنيف *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-kenzna-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الرابط المباشر (Slug)</label>
                <input
                  type="text"
                  placeholder="nuts, dried-fruits..."
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-kenzna-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">رابط صورة التصنيف *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-kenzna-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الوصف</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-kenzna-amber"
                />
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
                  {saving ? 'جاري الحفظ...' : 'حفظ التصنيف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
