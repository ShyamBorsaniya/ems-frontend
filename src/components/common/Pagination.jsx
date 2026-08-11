import React from 'react';

/**
 * Reusable Pagination Component
 * 
 * Supports backend response format:
 * {
 *   page: 1,
 *   page_size: 5,
 *   total_items: 8,
 *   total_pages: 2,
 *   next_page: 2,
 *   previous_page: null
 * }
 * 
 * @param {Object} props
 * @param {Object} props.pagination - Backend pagination object
 * @param {number} props.currentPage - Fallback current page
 * @param {number} props.totalPages - Fallback total pages
 * @param {number} props.totalItems - Fallback total items
 * @param {number} props.pageSize - Fallback page size
 * @param {Function} props.onPageChange - Handler called with target page number
 * @param {string} props.className - Extra CSS classes for container
 */
export default function Pagination({
  pagination,
  currentPage = 1,
  totalPages: totalPagesProp = 1,
  totalItems: totalItemsProp = 0,
  pageSize: pageSizeProp = 10,
  onPageChange,
  className = ''
}) {
  // Extract values from pagination object or fallback props
  const page = Number(pagination?.page ?? currentPage ?? 1);
  const pageSize = Number(pagination?.page_size ?? pageSizeProp ?? 10);
  const totalItems = Number(pagination?.total_items ?? totalItemsProp ?? 0);
  const totalPages = Number(
    pagination?.total_pages ?? totalPagesProp ?? (totalItems ? Math.ceil(totalItems / pageSize) : 1)
  );

  const nextPage = pagination?.next_page !== undefined ? pagination.next_page : (page < totalPages ? page + 1 : null);
  const prevPage = pagination?.previous_page !== undefined ? pagination.previous_page : (page > 1 ? page - 1 : null);

  // Range calculation
  const fromItem = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const toItem = Math.min(page * pageSize, totalItems);

  if (totalPages <= 1 && totalItems <= pageSize) {
    // If only 1 page and total items fit, show minimal summary or nothing
    if (totalItems === 0) return null;
    return (
      <div className={`flex items-center justify-between px-4 py-3 bg-white border-t border-slate-100 text-xs text-slate-500 rounded-b-2xl ${className}`}>
        <span>Showing all <strong className="font-semibold text-slate-800">{totalItems}</strong> entries</span>
      </div>
    );
  }

  // Generate page button array with truncation logic
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (page >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  const handlePageClick = (p) => {
    if (typeof p === 'number' && p !== page && p >= 1 && p <= totalPages) {
      if (onPageChange) {
        onPageChange(p);
      }
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 bg-white border-t border-slate-100 rounded-b-2xl ${className}`}>
      {/* 1. Showing range summary */}
      <div className="text-xs text-slate-500 font-medium">
        Showing <strong className="font-semibold text-slate-800">{fromItem}</strong> to{' '}
        <strong className="font-semibold text-slate-800">{toItem}</strong> of{' '}
        <strong className="font-semibold text-slate-800">{totalItems}</strong> entries
      </div>

      {/* 2. Navigation controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => prevPage !== null && handlePageClick(prevPage)}
          disabled={prevPage === null || page <= 1}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            prevPage === null || page <= 1
              ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer active:scale-95'
          }`}
        >
          <span>←</span> Prev
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-slate-400 font-medium">
                  ...
                </span>
              );
            }

            const isActive = p === page;

            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => handlePageClick(p)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => nextPage !== null && handlePageClick(nextPage)}
          disabled={nextPage === null || page >= totalPages}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            nextPage === null || page >= totalPages
              ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer active:scale-95'
          }`}
        >
          Next <span>→</span>
        </button>
      </div>
    </div>
  );
}
