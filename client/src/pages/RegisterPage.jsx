import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sparkles, UserPlus, Lock, Mail, Phone, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: true,
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await registerAuth({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      navigate('/account');
    } catch {
      // Handled in AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-premium space-y-6 text-right">
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
          <h2 className="text-2xl font-black text-stone-900 font-tajawal">إنشاء حساب جديد</h2>
          <p className="text-xs text-stone-500">انضم لعائلة كنزنا واستمتع بتجربة تسوق فريدة وعروض حصرية</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              الاسم الكامل <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="مثال: سارة الإدريسي"
                {...register('name', { required: 'يرجى إدخال الاسم الكامل' })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
              />
              <User size={18} className="absolute left-3 top-3.5 text-stone-400" />
            </div>
            {errors.name && (
              <span className="text-[11px] text-rose-500 mt-1 block font-medium">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'يرجى إدخال البريد الإلكتروني',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'بريد إلكتروني غير صحيح',
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
              <label className="block text-xs font-bold text-stone-700 mb-1">
                رقم الهاتف <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="06XXXXXXXX"
                  {...register('phone', {
                    required: 'يرجى إدخال رقم الهاتف',
                    pattern: {
                      value: /^(0|\+212)[5-7]\d{8}$/,
                      message: 'رقم هاتف مغربي صحيح',
                    },
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber font-mono"
                />
                <Phone size={18} className="absolute left-3 top-3.5 text-stone-400" />
              </div>
              {errors.phone && (
                <span className="text-[11px] text-rose-500 mt-1 block font-medium">
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'يرجى إدخال كلمة المرور',
                    minLength: { value: 6, message: '6 أحرف على الأقل' },
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

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                تأكيد كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'يرجى تأكيد كلمة المرور',
                    validate: (value) => value === password || 'كلمات المرور غير متطابقة',
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm focus:outline-none focus:border-kenzna-amber"
                />
                <Lock size={18} className="absolute left-3 top-3.5 text-stone-400" />
              </div>
              {errors.confirmPassword && (
                <span className="text-[11px] text-rose-500 mt-1 block font-medium">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600">
              <input
                type="checkbox"
                {...register('terms', {
                  required: 'يرجى الموافقة على شروط الاستخدام',
                })}
                className="rounded border-stone-300 text-kenzna-amber focus:ring-kenzna-amber w-4 h-4 mt-0.5"
              />
              <span>
                أوافق على <span className="text-kenzna-amber font-bold hover:underline">شروط الاستخدام</span> و{' '}
                <span className="text-kenzna-amber font-bold hover:underline">سياسة الخصوصية</span> الخاصة بمتجر كنزنا.
              </span>
            </label>
            {errors.terms && (
              <span className="text-[11px] text-rose-500 mt-1 block font-medium">
                {errors.terms.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-kenzna-amber hover:bg-kenzna-amber-hover text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>جاري إنشاء الحساب...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>إنشاء الحساب</span>
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-600">
          <span>لديك حساب بالفعل؟ </span>
          <Link to="/login" className="font-bold text-kenzna-amber hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
