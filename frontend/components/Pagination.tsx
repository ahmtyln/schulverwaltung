import React from 'react';

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange = () => {} }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="p-4 mx-8 my-5 flex items-center justify-around text-gray-500  rounded-lg">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="py-2 px-4  rounded-md bg-white hover:bg-gray-100 text-sm font-medium border disabled:opacity-50"
      >
        Prev
      </button>

      {/* Pages */}
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNum = currentPage + i - 1;
        if (pageNum < 1 || pageNum > totalPages) return null;
        
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded-sm font-medium ${
              currentPage === pageNum 
                ? "bg-blue-500 text-white" 
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="py-2 px-4 rounded-md bg-white hover:bg-gray-100 text-sm font-medium border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
