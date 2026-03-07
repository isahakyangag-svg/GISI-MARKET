
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
            currentPage === page
              ? 'bg-[#82C12D] text-white shadow-lg shadow-emerald-100'
              : 'text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-200'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
