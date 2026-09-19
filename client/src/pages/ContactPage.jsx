import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error('يرجى ملء الحقول الإلزامية');
      return;
    }
    setSubmitted(true);
    toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً 🎉');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs bg-kenzna-amber-light text-kenzna-amber font-bold px-3 py-1 rounded-full">
          يسعدنا تواصلكم
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-kenzna-brown font-tajawal">
          تواصل مع فريق كنزنا
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          هل لديك استفسار عن منتج، اقتراح، أو طلبية خاصة للأعراس والمناسبات؟ نحن في خدمتك دائماً.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4 text-right">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-kenzna-amber flex items-center justify-center shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">الاتصال المباشر</h4>
              <p className="text-xs text-stone-500 font-mono mt-0.5" dir="ltr">+212 661-000000</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">تواصل عبر واتساب</h4>
              <p className="text-xs text-stone-500 mt-0.5">خدمة عملاء فورية ومباشرة</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-kenzna-amber flex items-center justify-center shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">البريد الإلكتروني</h4>
              <p className="text-xs text-stone-500 mt-0.5">contact@kenzna.ma</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">ساعات العمل</h4>
              <p className="text-xs text-stone-500 mt-0.5">يومياً من 9:00 صباحاً إلى 9:00 مساءً</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-soft text-right">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle size={36} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-tajawal">تم استلام رسالتك!</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                شكراً لتواصلك معنا. سنقوم بالرد عليك عبر الهاتف أو البريد الإلكتروني في أقرب وقت.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setMessage('');
                }}
                className="text-xs font-bold text-kenzna-amber hover:underline"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
                أرسل لنا استفسارك
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الاسم الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="اسمك الكريم"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    رقم الهاتف <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="06XXXXXXXX"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">موضوع الرسالة</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="استفسار عن طلب، طلبية خاصة..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  نص الرسالة <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="اكتب تفاصيل استفسارك هنا..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                />
              </div>

              <button
                type="submit"
                className="bg-kenzna-amber hover:bg-kenzna-amber-hover text-white text-xs font-bold px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
