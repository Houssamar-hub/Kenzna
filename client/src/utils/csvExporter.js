import toast from 'react-hot-toast';
import { formatDate, orderStatusMap } from './formatters';

/**
 * Export array of orders to CSV file (Excel compatible with UTF-8 BOM for Arabic)
 */
export const exportOrdersToCSV = (orders = []) => {
  if (!orders || orders.length === 0) {
    toast.error('لا توجد طلبات لتصديرها');
    return;
  }

  const headers = [
    'رقم الطلب',
    'اسم العميل',
    'رقم الهاتف',
    'البريد الإلكتروني',
    'المدينة',
    'العنوان',
    'عدد الأصناف',
    'المبلغ الإجمالي (د.م)',
    'طريقة الدفع',
    'حالة الدفع',
    'حالة الطلب',
    'تاريخ الطلب',
  ];

  const rows = orders.map((o) => [
    `"${o.orderNumber || ''}"`,
    `"${(o.customerInfo?.fullName || o.user?.name || '').replace(/"/g, '""')}"`,
    `"${o.customerInfo?.phone || o.user?.phone || ''}"`,
    `"${o.customerInfo?.email || o.user?.email || ''}"`,
    `"${(o.shippingAddress?.city || '').replace(/"/g, '""')}"`,
    `"${(o.shippingAddress?.address || '').replace(/"/g, '""')}"`,
    o.items?.length || 0,
    o.totalAmount || 0,
    `"الدفع عند الاستلام"`,
    `"${o.paymentStatus === 'Paid' ? 'مدفوع' : 'غير مدفوع'}"`,
    `"${orderStatusMap[o.orderStatus]?.label || o.orderStatus}"`,
    `"${formatDate(o.createdAt)}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `طلبات_كنزنا_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success('تم تصدير ملف الطلبات (CSV) بنجاح! 📊');
};

/**
 * Export array of users/customers to CSV
 */
export const exportUsersToCSV = (users = []) => {
  if (!users || users.length === 0) {
    toast.error('لا يوجد مستخدمون لتصديرهم');
    return;
  }

  const headers = ['الاسم الكامل', 'البريد الإلكتروني', 'رقم الهاتف', 'الدور/الصلاحية', 'تاريخ التسجيل'];
  const rows = users.map((u) => [
    `"${(u.name || '').replace(/"/g, '""')}"`,
    `"${u.email || ''}"`,
    `"${u.phone || ''}"`,
    `"${u.role === 'admin' ? 'مدير' : 'عميل'}"`,
    `"${formatDate(u.createdAt)}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `عملاء_كنزنا_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success('تم تصدير ملف العملاء (CSV) بنجاح! 👥');
};
