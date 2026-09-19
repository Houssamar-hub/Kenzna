import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Star,
  Flame,
  Sparkles,
  ExternalLink,
  Upload,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    oldPrice: '',
    stock: '50',
    description: '',
    shortDescription: '',
    origin: 'المغرب',
    imageUrl: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800',
    featured: false,
    bestSeller: false,
    isNewArrival: false,
    p250Price: '',
    p500Price: '',
    p1kgPrice: '',
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setUploadingImage(true);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
        toast.success('تم رفع الصورة إلى Cloudinary بنجاح! ☁️');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل رفع الصورة إلى Cloudinary');
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data || []);
    } catch (err) {
      toast.error('فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      price: '50',
      oldPrice: '',
      stock: '50',
      description: 'وصف المنتج الفاخر...',
      shortDescription: '',
      origin: 'المغرب',
      imageUrl: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800',
      featured: false,
      bestSeller: false,
      isNewArrival: false,
      p250Price: '50',
      p500Price: '95',
      p1kgPrice: '180',
    });
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);

    const w250 = prod.weights?.find(w => w.weight === '250g')?.price || prod.price;
    const w500 = prod.weights?.find(w => w.weight === '500g')?.price || Math.round(prod.price * 1.9);
    const w1kg = prod.weights?.find(w => w.weight === '1kg')?.price || Math.round(prod.price * 3.7);

    setFormData({
      name: prod.name,
      category: prod.category?._id || prod.category,
      price: prod.price,
      oldPrice: prod.oldPrice || '',
      stock: prod.stock,
      description: prod.description,
      shortDescription: prod.shortDescription || '',
      origin: prod.origin || 'المغرب',
      imageUrl: prod.images?.[0] || '',
      featured: prod.featured || false,
      bestSeller: prod.bestSeller || false,
      isNewArrival: prod.isNewArrival || false,
      p250Price: w250,
      p500Price: w500,
      p1kgPrice: w1kg,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        stock: Number(formData.stock),
        description: formData.description,
        shortDescription: formData.shortDescription,
        origin: formData.origin,
        images: [formData.imageUrl],
        featured: formData.featured,
        bestSeller: formData.bestSeller,
        isNewArrival: formData.isNewArrival,
        weights: [
          { weight: '250g', price: Number(formData.p250Price || formData.price), stock: Number(formData.stock) },
          { weight: '500g', price: Number(formData.p500Price || Math.round(formData.price * 1.9)), stock: Number(formData.stock) },
          { weight: '1kg', price: Number(formData.p1kgPrice || Math.round(formData.price * 3.7)), stock: Number(formData.stock) },
        ],
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('تم تحديث المنتج بنجاح ✅');
      } else {
        await api.post('/products', payload);
        toast.success('تمت إضافة المنتج بنجاح 🎉');
      }

      setModalOpen(false);
      fetchInitialData();
    } catch (err) {
      toast.error(err.message || 'فشل حفظ المنتج');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف المنتج "${name}" نهائياً؟`)) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('تم حذف المنتج بنجاح');
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        toast.error(err.message || 'فشل حذف المنتج');
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCat === 'all' ||
      p.category?._id === selectedCat ||
      p.category?.slug === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 text-right">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 font-tajawal">
            إدارة المنتجات ({products.length})
          </h1>
          <p className="text-xs text-stone-500">
            إضافة، تعديل الأسعار والأوزان، وإدارة مخزون الكتالوج
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-soft flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="بحث بالاسم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-kenzna-amber"
          />
          <Search size={16} className="absolute left-3 top-3 text-stone-400" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-kenzna-amber w-full sm:w-auto cursor-pointer"
        >
          <option value="all">جميع التصنيفات</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
              <tr>
                <th className="py-4 px-4">الصورة</th>
                <th className="py-4 px-4">اسم المنتج</th>
                <th className="py-4 px-4">التصنيف</th>
                <th className="py-4 px-4">السعر الأساسي</th>
                <th className="py-4 px-4">المخزون</th>
                <th className="py-4 px-4">الشارات</th>
                <th className="py-4 px-4">التقييم</th>
                <th className="py-4 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <img
                      src={p.images?.[0]}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    />
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-900 max-w-xs">
                    <span>{p.name}</span>
                    <span className="text-[10px] text-stone-400 block font-normal">{p.origin}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    <span className="bg-stone-100 px-2.5 py-1 rounded-lg">
                      {p.category?.name || 'غير محدد'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-kenzna-brown">
                    {formatPrice(p.price)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold font-mono text-[11px] ${
                        p.stock <= 10
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {p.stock} وحدة
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {p.bestSeller && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          طلب عالي
                        </span>
                      )}
                      {p.featured && (
                        <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          مميز
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-500">
                    ★ {p.rating || 5.0} ({p.numReviews || 0})
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 text-stone-600 hover:text-kenzna-amber hover:bg-stone-100 rounded-xl transition-colors"
                        title="تعديل"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id, p.name)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-5 text-right shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                {editingProduct ? `تعديل المنتج: ${editingProduct.name}` : 'إضافة منتج جديد'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">اسم المنتج *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-kenzna-amber"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">التصنيف *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-kenzna-amber"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prices for Weights */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <span className="text-xs font-bold text-stone-800 block">
                  أسعار الأوزان المختلفة (درهم مغربي):
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">سعر 250g *</label>
                    <input
                      type="number"
                      required
                      value={formData.p250Price}
                      onChange={(e) => setFormData({ ...formData, p250Price: e.target.value, price: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">سعر 500g *</label>
                    <input
                      type="number"
                      required
                      value={formData.p500Price}
                      onChange={(e) => setFormData({ ...formData, p500Price: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">سعر 1kg *</label>
                    <input
                      type="number"
                      required
                      value={formData.p1kgPrice}
                      onChange={(e) => setFormData({ ...formData, p1kgPrice: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">كمية المخزون *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">المنشأ</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">صورة المنتج (Cloudinary / رابط)</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono"
                    />
                    <label className={`cursor-pointer px-4 py-2.5 rounded-xl border border-dashed border-kenzna-amber bg-amber-50/50 hover:bg-amber-50 text-kenzna-amber text-xs font-bold flex items-center gap-1.5 transition-all ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploadingImage ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>جاري الرفع...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>رفع من جهازك</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  {formData.imageUrl && (
                    <div className="flex items-center gap-3 p-2 bg-stone-50 rounded-xl border border-stone-200">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-stone-200"
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                      />
                      <div className="text-[11px] text-stone-500 truncate flex-1 font-mono">
                        {formData.imageUrl}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الوصف الكامل</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              {/* Feature Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-stone-300 text-kenzna-amber focus:ring-kenzna-amber w-4 h-4"
                  />
                  <span>منتج مميز ⭐</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                    className="rounded border-stone-300 text-kenzna-amber focus:ring-kenzna-amber w-4 h-4"
                  />
                  <span>الأكثر طلباً ومبيعاً 🔥</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded border-stone-300 text-kenzna-amber focus:ring-kenzna-amber w-4 h-4"
                  />
                  <span>وصل حديثاً ✨</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-3 rounded-xl hover:bg-stone-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-kenzna-amber text-white text-xs font-bold py-3 rounded-xl hover:bg-kenzna-amber-hover shadow-md"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
