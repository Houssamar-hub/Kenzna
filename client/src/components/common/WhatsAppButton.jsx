import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WhatsAppButton = ({ phoneNumber = '212600000000' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const defaultMessage = 'السلام عليكم، أود الاستفسار حول منتجات متجر كنزنا والطلب المباشر 🌿';

  const handleSend = (e) => {
    e.preventDefault();
    const msgToSend = customMsg.trim() || defaultMessage;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start font-cairo">
      {/* Floating Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-fade-in text-right">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                💬
              </div>
              <div>
                <h4 className="font-bold text-sm">خدمة عملاء كنزنا</h4>
                <p className="text-[11px] text-emerald-100">متاحون للرد على طلباتكم واستفساراتكم</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-stone-50 space-y-3">
            <div className="bg-white p-3 rounded-2xl rounded-tr-none shadow-xs border border-stone-100 text-xs text-stone-700 leading-relaxed">
              مرحباً بك في <strong>كنزنا</strong>! 🌿 كيف يمكننا مساعدتك اليوم بخصوص طلب المكسرات أو التوصيل؟
            </div>

            <form onSubmit={handleSend} className="space-y-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>إرسال عبر واتساب الآن</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Trigger Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2.5 hover:scale-105 active:scale-95"
        title="تواصل معنا عبر واتساب"
      >
        <MessageCircle size={24} className="animate-pulse" />
        <span className="hidden sm:inline font-bold text-xs font-tajawal">
          اطلب عبر واتساب 💬
        </span>
      </button>
    </div>
  );
};

export default WhatsAppButton;
