# كنزنا | Kenzna - متجر الفواكه الجافة والمكسرات الفاخرة 🌿

> **"كنز من الطبيعة إلى بابك"**

منصة تجارة إلكترونية مغربية وعربية متكاملة واحترافية متخصصة في بيع أجود أنواع الفواكه الجافة، المكسرات المحمصة والنيئة، البذور والحبوب الصحية، المنتجات المعسلة التقليدية، والخلطات الغذائية الملكية.

---

## 🛠️ بنية المشروع والتقنيات المستخدمة (Tech Stack)

### 🖥️ Frontend (الواجهة الأمامية)
- **React.js + Vite**: بيئة عمل سريعة وعصرية.
- **Tailwind CSS**: تصميم مخصص بالكامل مع هوية بصرية مغربية فاخرة وألوان طبيعية (Beige, Roasted Brown, Amber, Olive Green, Moroccan Gold).
- **RTL Support**: دعم كامل 100% للغة العربية مع خطوط Google الخطوطية (Cairo & Tajawal).
- **React Router DOM v7**: توجيه وحماية المسارات (Protected Routes).
- **Context API**: إدارة الحالات (AuthContext, CartContext, FavoritesContext).
- **Lucide React**: أيقونات عصرية وعالية الدقة.
- **React Hook Form**: معالجة النماذج وفحص صحة المدخلات.
- **React Hot Toast**: تنبيهات تفاعلية فورية باللغة العربية.

### ⚙️ Backend (الخادم وقاعدة البيانات)
- **Node.js & Express.js**: RESTful API معماري مقسم واحترافي.
- **MongoDB & Mongoose**: تخزين البيانات مع schemas دقيقة وعلاقات متناسقة (مع دعم In-Memory Fallback للتطوير المباشر).
- **JWT Authentication**: نظام توثيق مشفر وآمن مع تشفير كلمات المرور بـ `bcryptjs`.
- **Role-Based Authorization**: حماية مسارات الإدارة والتأكد من صلاحيات المدير (`adminMiddleware`).

---

## 🚀 تشغيل المشروع (Quick Start)

### 1. تشغيل الخادم (Backend Server)
```bash
cd server
npm install
npm start
```
*الخادم سيعمل على المنفذ: `http://localhost:5000`*

### 2. تشغيل واجهة المتجر (Frontend Client)
```bash
cd client
npm install
npm run dev
```
*واجهة المتجر ستعمل على: `http://localhost:5173`*

---

## 🔑 الحسابات التجريبية الجاهزة (Demo Credentials)

| الحساب | البريد الإلكتروني | كلمة المرور | الصلاحية |
| :--- | :--- | :--- | :--- |
| **المدير العام (Admin)** | `admin@kenzna.ma` | `admin123456` | صلاحيات كاملة لإدارة المتجر والطلبات والمنتجات |
| **عميل تجريبي (Customer)** | `youssef@example.com` | `user123456` | تصفح وشراء وتتبع الطلبات والعناوين |

---

## 📂 الهيكلية العامة للمشروع (Project Structure)

```text
Kenzna/
├── client/
│   ├── src/
│   │   ├── components/       # Common, Products, Cart, Admin Components
│   │   ├── context/          # AuthContext, CartContext, FavoritesContext
│   │   ├── layouts/          # MainLayout (Storefront), AdminLayout
│   │   ├── pages/            # Home, Products, ProductDetail, Cart, Checkout, Account, Admin...
│   │   ├── services/         # Axios API Client
│   │   └── utils/            # Formatters (MAD, Dates, Statuses)
│   └── ...
│
├── server/
│   ├── config/               # Database Connection (MongoDB / In-Memory Fallback)
│   ├── controllers/          # Auth, Products, Orders, Categories, Users, Coupons, Admin...
│   ├── data/                 # Seeder & Sample Moroccan Products Dataset
│   ├── middleware/           # JWT Protect, Admin Role Checker, Error Handler
│   ├── models/               # User, Product, Category, Order, Coupon, Review
│   ├── routes/               # Express REST API Endpoints
│   └── server.js
│
└── README.md
```

---

## 👑 المميزات الرئيسية

1. **تجربة تسوق مغربية أصيلة**: دعم الدرهم المغربي (د.م. / MAD)، نظام الدفع عند الاستلام (COD)، والشحن المجاني التلقائي للطلبات فوق 300 د.م.
2. **تحديد الأوزان والكميات**: اختيار وزن المنتج (250g, 500g, 1kg) مع حساب فوري للسعر والمخزون.
3. **نظام كوبونات الخصم**: خصومات بنسب مئوية أو مبالغ ثابتة مع فحص الحد الأدنى وتاريخ الصلاحية.
4. **لوحة تحكم إدارية شاملة**:
   - إحصائيات المبيعات، الطلبات، الزبائن، والمنتجات منخفضة المخزون.
   - رسم بياني لحركة المبيعات الشهرية.
   - إدارة كاملة للمنتجات، التصنيفات، الطلبات وتغيير حالتها، والمستخدمين.
5. **لوحة تحكم المستخدم**: إدارة العناوين المتعددة، تتبع شريط مراحل الطلب، وقائمة المنتجات المفضلة.
