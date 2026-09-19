// Currency formatter in Moroccan Dirham (MAD / د.م.)
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '0 د.م.';
  return `${Number(price).toLocaleString('ar-MA')} د.م.`;
};

// Date formatter in Arabic
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Order status translations and colors
export const orderStatusMap = {
  Pending: {
    label: 'في الانتظار',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    step: 1,
  },
  Confirmed: {
    label: 'تم التأكيد',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    step: 2,
  },
  Preparing: {
    label: 'قيد التحضير',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
    step: 3,
  },
  Shipped: {
    label: 'تم الشحن',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    step: 4,
  },
  Delivered: {
    label: 'تم التوصيل 🎉',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    step: 5,
  },
  Cancelled: {
    label: 'ملغى',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    step: 0,
  },
};
