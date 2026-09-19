import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import Review from '../models/Review.js';
import { categoriesData } from './categories.js';
import { productsData } from './products.js';
import { usersData, couponsData } from './users.js';

dotenv.config();

export const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();

    console.log('🗑️ Previous data cleared...');

    // 1. Insert Users
    const createdUsers = await User.create(usersData);
    const adminUser = createdUsers[0]._id;
    const regularUser = createdUsers[1]._id;

    // 2. Insert Coupons
    await Coupon.create(couponsData);

    // 3. Insert Categories
    const createdCategories = await Category.create(categoriesData);

    // Create a slug -> ObjectId map for categories
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // 4. Prepare and Insert Products
    const preparedProducts = productsData.map((prod) => {
      const { categorySlug, ...rest } = prod;
      return {
        ...rest,
        category: categoryMap[categorySlug] || createdCategories[0]._id,
      };
    });

    const createdProducts = await Product.create(preparedProducts);

    // 5. Insert Sample Reviews
    const sampleReviews = [
      {
        product: createdProducts[0]._id,
        user: regularUser,
        userName: 'يوسف العلمي',
        rating: 5,
        comment: 'كاوكاو بالجبن رائع ومقرمش جداً، جودة لا يُعلى عليها وتغليف راقي يثبت الاحترافية!',
      },
      {
        product: createdProducts[3]._id, // Honey almonds
        user: createdUsers[2]._id,
        userName: 'سارة الإدريسي',
        rating: 5,
        comment: 'اللوز المعسل بالعسل والسمسم من أروع ما تذوقت، هش ومقرمش ولذيذ مع الشاي المغربي.',
      },
      {
        product: createdProducts[4]._id, // BBQ Cashews
        user: regularUser,
        userName: 'يوسف العلمي',
        rating: 5,
        comment: 'كاجو الباربكيو المدخن نكهته لا تقاوم، يستحق كل درهم!',
      },
    ];

    await Review.create(sampleReviews);

    // 6. Insert Sample Orders
    const sampleOrders = [
      {
        orderNumber: 'KNZ-1001',
        user: regularUser,
        customerInfo: {
          fullName: 'يوسف العلمي',
          email: 'youssef@example.com',
          phone: '0662345678',
        },
        shippingAddress: {
          city: 'الرباط',
          district: 'أكدال',
          address: 'شارع فرنسا، إقامة الياسمين شقة 12',
          notes: 'يرجى الاتصال قبل الوصول بنصف ساعة',
        },
        items: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            image: createdProducts[0].images[0],
            weight: '500g',
            quantity: 1,
            price: 45,
          },
          {
            product: createdProducts[1]._id,
            name: createdProducts[1].name,
            image: createdProducts[1].images[0],
            weight: '500g',
            quantity: 2,
            price: 95,
          },
        ],
        paymentMethod: 'COD',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        itemsPrice: 235,
        shippingPrice: 25,
        discountAmount: 23.5,
        couponCode: 'KENZNA10',
        totalAmount: 236.5,
        statusHistory: [
          { status: 'Pending', date: new Date(Date.now() - 5 * 86400000), note: 'تم استلام الطلب' },
          { status: 'Confirmed', date: new Date(Date.now() - 4 * 86400000), note: 'تم تأكيد الطلب هاتفياً' },
          { status: 'Preparing', date: new Date(Date.now() - 3 * 86400000), note: 'جاري التجهيز والتغليف' },
          { status: 'Shipped', date: new Date(Date.now() - 2 * 86400000), note: 'تم الشحن مع أمانة إكسبريس' },
          { status: 'Delivered', date: new Date(Date.now() - 1 * 86400000), note: 'تم التسليم بنجاح واستلام المبلغ' },
        ],
      },
      {
        orderNumber: 'KNZ-1002',
        user: createdUsers[2]._id,
        customerInfo: {
          fullName: 'سارة الإدريسي',
          email: 'sara@example.com',
          phone: '0663456789',
        },
        shippingAddress: {
          city: 'مراكش',
          district: 'جليز',
          address: 'شارع محمد السادس، إقامة النخيل',
        },
        items: [
          {
            product: createdProducts[createdProducts.length - 1]._id, // Pack Cadeau
            name: createdProducts[createdProducts.length - 1].name,
            image: createdProducts[createdProducts.length - 1].images[0],
            weight: '1kg',
            quantity: 1,
            price: 380,
          },
        ],
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Shipped',
        itemsPrice: 380,
        shippingPrice: 0,
        discountAmount: 0,
        statusHistory: [
          { status: 'Pending', date: new Date(Date.now() - 2 * 86400000), note: 'تم استلام الطلب' },
          { status: 'Confirmed', date: new Date(Date.now() - 1 * 86400000), note: 'تم تأكيد الطلب' },
          { status: 'Shipped', date: new Date(), note: 'في طريق التوصيل للزبون' },
        ],
      },
    ];

    await Order.create(sampleOrders);

    console.log('✅ Kenzna Seed Data Imported Successfully! 🎉');
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    console.error(error.stack);
  }
};

export const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();

    console.log('🗑️ Kenzna Data Destroyed Successfully!');
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
  }
};

// Automatic seed if database is empty on server startup
export const autoSeedIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Auto-seeding Kenzna catalog...');
      await importData();
    }
  } catch (err) {
    console.warn(`Could not auto seed: ${err.message}`);
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  const runSeeder = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kenzna');
      console.log(`Connected to ${conn.connection.host} for seeding...`);
      if (process.argv[2] === '-d') {
        await destroyData();
      } else {
        await importData();
      }
      process.exit();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
  runSeeder();
}
