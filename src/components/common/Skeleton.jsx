import React from 'react';

// Generic pulsing placeholder line
export function SkeletonLine({ className = 'h-4 w-full', rounded = 'rounded' }) {
  return (
    <div className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`} />
  );
}

// Generic pulsing placeholder circle
export function SkeletonCircle({ className = 'w-10 h-10' }) {
  return (
    <div className={`animate-pulse bg-slate-200/80 rounded-full ${className}`} />
  );
}

// Table skeleton loader matching general listings
export function TableSkeleton({ rows = 5, columns = [] }) {
  // Fallback columns if none provided
  const defaultCols = [
    { type: 'avatar-text', className: 'py-3 px-4' },
    { type: 'text', className: 'py-3 px-4' },
    { type: 'pill', className: 'py-3 px-4' },
    { type: 'text', className: 'py-3 px-4' },
    { type: 'actions', className: 'py-3 px-4' },
  ];
  
  const cols = columns.length > 0 ? columns : defaultCols;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold font-sans">
            {cols.map((col, idx) => (
              <th key={idx} className={`${col.className || 'py-3 px-4'}`}>
                <SkeletonLine className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, rIdx) => (
            <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
              {cols.map((col, cIdx) => (
                <td key={cIdx} className={`${col.className || 'py-3.5 px-4'}`}>
                  {col.type === 'avatar-text' ? (
                    <div className="flex items-center gap-3">
                      <SkeletonCircle className="w-9 h-9" />
                      <div className="flex flex-col gap-1.5 w-full max-w-[150px]">
                        <SkeletonLine className="h-3.5 w-2/3" />
                        <SkeletonLine className="h-2.5 w-full" />
                      </div>
                    </div>
                  ) : col.type === 'pill' ? (
                    <SkeletonLine className="h-5 w-16" rounded="rounded-full" />
                  ) : col.type === 'actions' ? (
                    <div className="flex gap-2 justify-center">
                      <SkeletonCircle className="w-7 h-7 shrink-0" />
                      <SkeletonCircle className="w-7 h-7 shrink-0" />
                    </div>
                  ) : (
                    // Default/text
                    <SkeletonLine className="h-3 w-3/4" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Card skeleton (for Project Management dashboard)
export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-4 shadow-xs"
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <SkeletonLine className="h-5 w-24" />
                <SkeletonLine className="h-4 w-12" rounded="rounded-full" />
              </div>
              <SkeletonLine className="h-3 w-16" />
            </div>
            <SkeletonLine className="h-4 w-10" rounded="rounded-full" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 mt-2">
            <SkeletonLine className="h-3 w-full" />
            <SkeletonLine className="h-3 w-5/6" />
          </div>

          {/* Progress bar info */}
          <div className="mt-2 flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <SkeletonLine className="h-2.5 w-12" />
              <SkeletonLine className="h-2.5 w-8" />
            </div>
            <SkeletonLine className="h-2 w-full" rounded="rounded-full" />
          </div>

          {/* Footer: Manager details + members avatar group */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <SkeletonCircle className="w-6 h-6" />
              <SkeletonLine className="h-3 w-20" />
            </div>
            {/* Avatar group */}
            <div className="flex -space-x-2">
              <SkeletonCircle className="w-6 h-6 border border-white" />
              <SkeletonCircle className="w-6 h-6 border border-white" />
              <SkeletonCircle className="w-6 h-6 border border-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Profile skeleton (for My Profile and Company Profile page layouts)
export function ProfileSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Profile Header Banner */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5 w-full">
          <SkeletonCircle className="w-24 h-24 border-4 border-slate-50 shadow-sm shrink-0" />
          <div className="flex flex-col gap-2.5 items-center md:items-start w-full">
            <SkeletonLine className="h-6 w-48" />
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full">
              <SkeletonLine className="h-4.5 w-24" rounded="rounded-full" />
              <SkeletonLine className="h-4.5 w-32" rounded="rounded-full" />
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <SkeletonLine className="h-10 w-28" rounded="rounded-xl" />
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: General Profile Summary */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <SkeletonLine className="h-4 w-32 mb-2" />
            <SkeletonLine className="h-3 w-full" />
            <SkeletonLine className="h-3 w-5/6" />
          </div>
          <hr className="border-slate-100" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <SkeletonLine className="h-3 w-16" />
                <SkeletonLine className="h-3 w-28" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Details forms grid */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <SkeletonLine className="h-5 w-40" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <SkeletonLine className="h-3 w-24" />
                <SkeletonLine className="h-10 w-full" rounded="rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Skeleton = {
  Line: SkeletonLine,
  Circle: SkeletonCircle,
  Table: TableSkeleton,
  Card: CardSkeleton,
  Profile: ProfileSkeleton
};

export default Skeleton;
