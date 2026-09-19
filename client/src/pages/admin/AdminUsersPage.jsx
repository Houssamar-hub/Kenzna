import React, { useState, useEffect } from 'react';
import { Users, Shield, ShieldCheck, UserX, UserCheck, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      toast.error('فشل تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      toast.success(`تم تغيير الصلاحية إلى ${newRole === 'admin' ? 'مدير' : 'مستخدم عادي'}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'فشل تحديث الصلاحية');
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !currentStatus });
      toast.success(currentStatus ? 'تم تعطيل الحساب' : 'تم تفعيل الحساب');
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'فشل تحديث الحالة');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (window.confirm(`هل أنت متأكد من حذف حساب "${name}"؟`)) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success('تم حذف المستخدم بنجاح');
        fetchUsers();
      } catch (err) {
        toast.error(err.message || 'فشل حذف المستخدم');
      }
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 font-tajawal">
            إدارة المستخدمين والزبناء ({users.length})
          </h1>
          <p className="text-xs text-stone-500">مشاهدة حسابات الزبناء، تعيين المدراء، وإدارة الصلاحيات</p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="بحث بالاسم أو البريد أو الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-kenzna-amber shadow-xs"
          />
          <Search size={16} className="absolute left-3 top-3 text-stone-400" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
              <tr>
                <th className="py-4 px-4">المستخدم</th>
                <th className="py-4 px-4">البريد الإلكتروني</th>
                <th className="py-4 px-4">رقم الهاتف</th>
                <th className="py-4 px-4">الصلاحية (Role)</th>
                <th className="py-4 px-4">عدد الطلبات</th>
                <th className="py-4 px-4">تاريخ التسجيل</th>
                <th className="py-4 px-4">الحالة</th>
                <th className="py-4 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 font-bold flex items-center justify-center">
                        {u.name?.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-600">{u.email}</td>
                  <td className="py-3.5 px-4 font-mono text-stone-600">{u.phone}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {u.role === 'admin' ? 'مدير (Admin)' : 'مستخدم (User)'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold font-mono text-stone-800">
                    {u.orderCount || 0} طلب
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-400">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive !== false
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {u.isActive !== false ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleToggleRole(u._id, u.role)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                        title={u.role === 'admin' ? 'تخفيض إلى مستخدم' : 'ترقية لمدير'}
                      >
                        <Shield size={14} />
                      </button>

                      <button
                        onClick={() => handleToggleActive(u._id, u.isActive !== false)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                        title={u.isActive !== false ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                      >
                        {u.isActive !== false ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
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
    </div>
  );
};

export default AdminUsersPage;
