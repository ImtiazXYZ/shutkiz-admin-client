import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Max number of visible page links
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    // Start page for the pagination window
    let startPage = Math.max(1, currentPage - halfVisiblePages);
    // End page for the pagination window
    let endPage = Math.min(totalPages, currentPage + halfVisiblePages);

    // Adjust start and end if currentPage is near the start or end of page range
    if (currentPage <= halfVisiblePages) {
      endPage = Math.min(totalPages, maxVisiblePages);
    } else if (currentPage + halfVisiblePages >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add the first page and ellipsis if necessary
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 mx-1 rounded-md bg-gray-200"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots-start" className="px-2">...</span>);
      }
    }

    // Add page numbers within the pagination window
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 mx-1 rounded-md ${
            i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    // Add the last page and ellipsis if necessary
    if (endPage < totalPages - 1) {
      pages.push(<span key="dots-end" className="px-2">...</span>);
    }
    if (endPage < totalPages) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 mx-1 rounded-md bg-gray-200"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center my-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 rounded-md ${
          currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-gray-200'
        }`}
      >
        Previous
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 rounded-md ${
          currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-gray-200'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
