export const usersData = [
  {
    name: 'المدير العام لكنزنا',
    email: 'admin@kenzna.ma',
    phone: '0661000000',
    password: 'admin123456',
    role: 'admin',
    addresses: [
      {
        title: 'المكتب الرئيسي كنزنا',
        city: 'الدار البيضاء',
        district: 'المعاريف',
        street: 'شارع الزرقطوني، عمارة الأطلس، الطابق 4',
        phone: '0661000000',
        isDefault: true,
      },
    ],
  },
  {
    name: 'يوسف العلمي',
    email: 'youssef@example.com',
    phone: '0662345678',
    password: 'user123456',
    role: 'user',
    addresses: [
      {
        title: 'المنزل',
        city: 'الرباط',
        district: 'أكدال',
        street: 'شارع فرنسا، إقامة الياسمين شقة 12',
        phone: '0662345678',
        isDefault: true,
      },
    ],
  },
  {
    name: 'سارة الإدريسي',
    email: 'sara@example.com',
    phone: '0663456789',
    password: 'user123456',
    role: 'user',
    addresses: [
      {
        title: 'شقة مراكش',
        city: 'مراكش',
        district: 'جليز',
        street: 'شارع محمد السادس، إقامة النخيل',
        phone: '0663456789',
        isDefault: true,
      },
    ],
  },
];

export const couponsData = [
  {
    code: 'KENZNA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 150,
    expiryDate: new Date('2028-12-31'),
    usageLimit: 500,
    isActive: true,
  },
  {
    code: 'NATURE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 300,
    expiryDate: new Date('2028-12-31'),
    usageLimit: 200,
    isActive: true,
  },
  {
    code: 'WELCOME50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 400,
    expiryDate: new Date('2028-12-31'),
    usageLimit: 100,
    isActive: true,
  },
];
