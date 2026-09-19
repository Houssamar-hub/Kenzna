import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-soft animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full aspect-square bg-stone-200 rounded-xl mb-4"></div>
        <div className="h-4 bg-stone-200 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-stone-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-stone-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-stone-200 rounded w-2/3 mb-4"></div>
      </div>
      <div>
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="h-6 bg-stone-200 rounded w-1/3"></div>
          <div className="h-9 w-9 bg-stone-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
