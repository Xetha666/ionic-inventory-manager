import React from 'react';

export const ProductSkeleton: React.FC = () => (
  <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-md flex flex-col gap-md animate-pulse">
    <div className="flex gap-md">
      <div className="w-16 h-16 rounded-xl bg-outline-variant/20 shrink-0" />
      <div className="flex-1 flex flex-col justify-center gap-xs">
        <div className="h-4 bg-outline-variant/20 rounded-md w-3/4" />
        <div className="h-3 bg-outline-variant/20 rounded-md w-1/2 mt-1" />
      </div>
    </div>
    <div className="flex items-center justify-between border-t border-outline-variant/30 pt-sm mt-auto">
      <div className="flex flex-col gap-xs">
        <div className="h-2.5 bg-outline-variant/20 rounded-md w-10" />
        <div className="h-4 bg-outline-variant/20 rounded-md w-20" />
      </div>
      <div className="h-6 w-20 bg-outline-variant/20 rounded-full" />
    </div>
  </div>
);

export default ProductSkeleton;
