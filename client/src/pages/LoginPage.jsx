import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sparkles, LogIn, Lock, Mail, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      navigate(redirectPath);
    } catch {
      // toast in AuthContext handles it
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins for easy testing
  const handleQuickLogin = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    login(email, password).then(() => {
      navigate(redirectPath);
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-premium space-y-6 text-right">
        {/* Logo & Headline */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-kenzna-amber to-kenzna-brown flex items-center justify-center text-white shadow-md">
              <Sparkles size={20} className="text-kenzna-gold-light" />
            </div>
            <span className="text-2xl font-black text-kenzna-brown font-tajawal">
              كَنـْـزنَا <span className="text-kenzna-amber text-lg">KENZNA</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-stone-900 font-tajawal">تسجيل الدخول</h2>
          <p className="text-xs text-stone-500">أهلاً بك مجدداً في متجر كنزنا للمنتجات الطبيعية</p>
        </div>

        {/* Demo Fast Logins */}
        <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60 space-y-2">
          <span className="text-[11px] font-bold text-amber-900 block text-center">
            ⚡ تسجيل دخول تجريبي سريع:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@kenzna.ma', 'admin123456')}
              className="bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold py-1.5 px-2 rounded-xl transition-colors"
            >
              حساب المدير (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('youssef@example.com', 'user123456')}
              className="bg-stone-700 hover:bg-stone-800 text-white text-[11px] font-bold py-1.5 px-2 rounded-xl transition-colors"
            >
              حساب عميل (User)
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="example@kenzna.ma"
                {...register('email', {
                  required: 'يرجى إدخال البريد الإلكتروني',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'يرجى إدخال بريد إلكتروني صحيح',
                  },
                })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
              />
              <Mail size={18} className="absolute left-3 top-3.5 text-stone-400" />
            </div>
            {errors.email && (
              <span className="text-[11px] text-rose-500 mt-1 block font-medium">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700">كلمة المرور</label>
              <span className="text-[11px] text-kenzna-amber hover:underline cursor-pointer">
                نسيت كلمة المرور؟
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'يرجى إدخال كلمة المرور',
                  minLength: { value: 6, message: 'كلمة المرور يجب أن لا تقل عن 6 أحرف' },
                })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3.5 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[11px] text-rose-500 mt-1 block font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="rounded border-stone-300 text-kenzna-amber focus:ring-kenzna-amber w-4 h-4"
              />
              <span>تذكرني على هذا الجهاز</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-kenzna-amber hover:bg-kenzna-amber-hover text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>جاري التحقق...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>

        {/* Link to Register */}
        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-600">
          <span>ليس لديك حساب بعد؟ </span>
          <Link to="/register" className="font-bold text-kenzna-amber hover:underline">
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
