import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Award, ShieldCheck, Heart, ArrowLeft } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-kenzna-brown via-kenzna-brown-light to-amber-950 text-white rounded-3xl p-8 sm:p-14 shadow-premium text-center space-y-4">
        <span className="text-xs bg-kenzna-gold text-kenzna-brown font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
          قصة كنزنا
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-tajawal">
          كنز من الطبيعة المغربية إلى باب بيتك
        </h1>
        <p className="text-xs sm:text-sm text-stone-200 max-w-2xl mx-auto leading-relaxed">
          انطلقت كنزنا من شغف عميق بخيرات الأرض المغربية الأصيلة، ورغبة في إيصال أجود أنواع المكسرات والفواكه الجافة والمنتجات المعسلة بأعلى معايير النقاء والفخامة.
        </p>
      </div>

      {/* Pillars / Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-soft text-right space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-kenzna-amber flex items-center justify-center font-bold">
            <Leaf size={24} />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-tajawal">نقاء وطبيعة 100%</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            نختار ثمارنا بعناية فائقة من المزارع والواحات الوطنية والعالمية بدون أي ملونات صناعية أو زيوت مهدرجة.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-soft text-right space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award size={24} />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-tajawal">تغليف ملكي محكم</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            نعتمد تقنيات تعبئة صحية ومحكمة تضمن بقاء المنتجات طازجة ومقرمشة وكأنها حُصدت للتو.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-soft text-right space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Heart size={24} />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-tajawal">خدمة عملاء استثنائية</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            فريقنا يسهر على متابعة كل طلب والحرص على رضاكم التام من لحظة الضغط على زر الشراء حتى وصول المندوب لبابكم.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-kenzna-beige rounded-3xl p-8 sm:p-12 border border-amber-900/10 text-center space-y-4">
        <h3 className="text-2xl font-black text-kenzna-brown font-tajawal">
          هل أنت مستعد لتذوق الفرق الحقيقي؟
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          استكشف أصنافنا الحصرية وعش تجربة التذوق الفاخرة التي يقدمها كنزنا.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-full shadow-md transition-all hover:scale-105"
        >
          <span>تصفح المتجر الآن</span>
          <ArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
