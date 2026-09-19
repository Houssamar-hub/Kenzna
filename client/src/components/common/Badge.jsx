import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: 'bg-stone-100 text-stone-700 border-stone-200',
    amber: 'bg-kenzna-amber-light text-kenzna-amber border-kenzna-amber/30',
    gold: 'bg-kenzna-gold-light text-kenzna-gold-dark border-kenzna-gold/30',
    green: 'bg-kenzna-green-soft text-kenzna-green border-kenzna-green/30',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    blue: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
