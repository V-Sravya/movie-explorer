import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Display limited number of pages
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range = [];
    
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);
    
    // Ensure we always show at least 5 pages if available
    if (end - start < 4) {
      if (currentPage < totalPages / 2) {
        end = Math.min(totalPages, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }
    }
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      range.push(1);
      if (start > 2) {
        range.push('...');
      }
    }
    
    // Add visible pages
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    // Add last page and ellipsis if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        range.push('...');
      }
      range.push(totalPages);
    }
    
    return range;
  };

  const visiblePages = getVisiblePages();
  
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      
      {visiblePages.map((page, index) => 
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`pagination-button ${
              currentPage === page ? 'active' : ''
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="pagination-ellipsis">...</span>
        )
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}; 