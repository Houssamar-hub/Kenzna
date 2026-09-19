import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  Truck,
  Leaf,
  HeartHandshake,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('شكراً لاشتراكك في نشرة كنزنا الإخبارية! 🎉');
      setEmail('');
    }
  };

  return (
    <footer className="bg-kenzna-brown text-white pt-16 pb-8 border-t border-stone-800">
      {/* Trust Badges Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-kenzna-brown-light/60 p-6 rounded-3xl border border-amber-900/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-kenzna-gold flex items-center justify-center shrink-0">
              <Leaf size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">طبيعي 100% وطازج</h4>
              <p className="text-xs text-stone-300">مختارة بعناية بدون مواد حافظة</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-kenzna-gold flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">توصيل سريع ومضمون</h4>
              <p className="text-xs text-stone-300">إلى باب منزلك في جميع أنحاء المغرب</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-kenzna-gold flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">الدفع عند الاستلام</h4>
              <p className="text-xs text-stone-300">افحص طلبك وادفع بعد المعاينة</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-kenzna-gold flex items-center justify-center shrink-0">
              <HeartHandshake size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">ضمان الجودة والرقي</h4>
              <p className="text-xs text-stone-300">إمكانية الاسترجاع إن لم يعجبك المنتج</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-700/60 text-sm">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-kenzna-amber to-amber-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={24} className="text-kenzna-gold-light" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white font-tajawal">
                كَنـْـزنَا <span className="text-kenzna-gold text-lg">KENZNA</span>
              </span>
              <span className="text-[10px] font-medium text-stone-300">
                كنز من الطبيعة إلى بابك
              </span>
            </div>
          </Link>

          <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
            متجر مغربي رائد متخصص في بيع أجود أنواع المكسرات الفاخرة، الفواكه الجافة، البذور الطبيعية، المنتجات المعسلة التقليدية، والخلطات الصحية المبتكرة. ننتقي منتجاتنا بحب لتصلك طازجة وبأرقى تغليف.
          </p>

          <div className="pt-2">
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني للعروض..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-stone-800/80 border border-stone-700 text-xs text-white rounded-xl px-4 py-2.5 flex-1 focus:outline-none focus:border-kenzna-gold"
              />
              <button
                type="submit"
                aria-label="اشتراك"
                className="bg-kenzna-amber hover:bg-kenzna-amber-hover text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all"
              >
                <span>اشترك</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-base font-tajawal text-kenzna-gold">
            التصنيفات
          </h4>
          <ul className="space-y-2 text-stone-300 text-xs">
            <li>
              <Link to="/products?category=nuts" className="hover:text-kenzna-gold transition-colors">
                المكسرات الفاخرة
              </Link>
            </li>
            <li>
              <Link to="/products?category=dried-fruits" className="hover:text-kenzna-gold transition-colors">
                الفواكه الجافة الطبيعية
              </Link>
            </li>
            <li>
              <Link to="/products?category=seeds" className="hover:text-kenzna-gold transition-colors">
                البذور والحبوب الصحية
              </Link>
            </li>
            <li>
              <Link to="/products?category=honeyed" className="hover:text-kenzna-gold transition-colors">
                المنتجات المعسلة المقرمشة
              </Link>
            </li>
            <li>
              <Link to="/products?category=mixes" className="hover:text-kenzna-gold transition-colors">
                الخلطات الملكية (Mixes)
              </Link>
            </li>
            <li>
              <Link to="/products?category=packs" className="hover:text-kenzna-gold transition-colors">
                باقات وصناديق الهدايا
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-base font-tajawal text-kenzna-gold">
            روابط سريعة
          </h4>
          <ul className="space-y-2 text-stone-300 text-xs">
            <li>
              <Link to="/products" className="hover:text-kenzna-gold transition-colors">
                جميع المنتجات
              </Link>
            </li>
            <li>
              <Link to="/products?featured=true" className="hover:text-kenzna-gold transition-colors">
                العروض والخصومات
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-kenzna-gold transition-colors">
                حسابي وتتبع الطلب
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-kenzna-gold transition-colors">
                قصة كنزنا
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-kenzna-gold transition-colors">
                اتصل بنا
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-base font-tajawal text-kenzna-gold">
            خدمة الزبناء
          </h4>
          <ul className="space-y-3 text-stone-300 text-xs">
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-kenzna-gold shrink-0" />
              <span dir="ltr" className="font-mono text-right">+212 661-000000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-kenzna-gold shrink-0" />
              <span>contact@kenzna.ma</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-kenzna-gold shrink-0 mt-0.5" />
              <span>الدار البيضاء، المغرب - توصيل لكافة المدن</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={16} className="text-kenzna-gold shrink-0" />
              <span>يومياً من 9:00 صباحاً حتى 9:00 مساءً</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
        <p>© {new Date().getFullYear()} كنزنا (Kenzna). جميع الحقوق محفوظة.</p>
        <div className="flex items-center gap-4 text-stone-400">
          <span className="hover:text-white cursor-pointer">الشروط والأحكام</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">سياسة الخصوصية</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">سياسة التوصيل والإرجاع</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
