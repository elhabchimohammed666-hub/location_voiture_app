import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-white/5 animate-pulse flex flex-col">
      {/* Image Skeleton */}
      <div className="h-56 bg-slate-800/60 w-full relative">
        <div className="absolute top-4 left-4 w-20 h-6 bg-slate-700/60 rounded-full" />
        <div className="absolute top-4 right-4 w-12 h-6 bg-slate-700/60 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div className="w-32 h-6 bg-slate-700/60 rounded-lg" />
            <div className="w-16 h-6 bg-slate-700/60 rounded-lg" />
          </div>
          <div className="w-48 h-4 bg-slate-800/80 rounded" />
        </div>

        {/* Specs Badges */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5">
          <div className="h-8 bg-slate-800/60 rounded-xl" />
          <div className="h-8 bg-slate-800/60 rounded-xl" />
          <div className="h-8 bg-slate-800/60 rounded-xl" />
        </div>

        {/* Footer / CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="w-24 h-8 bg-slate-800/70 rounded-lg" />
          <div className="w-28 h-10 bg-slate-700/70 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
