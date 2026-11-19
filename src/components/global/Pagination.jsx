import { memo } from "react";
import PropTypes from "prop-types";
import { getPageNumbers } from "../../lib/pagination";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  isLoading = false,
  className = "",
}) => {
  const safeCurrentPage = Math.max(1, Number(currentPage) || 1);
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safeTotalItems = Math.max(0, Number(totalItems) || 0);
  const safeItemsPerPage = Math.max(1, Number(itemsPerPage) || 10);

  // Range calculation
  const startRecord =
    safeTotalItems === 0
      ? 0
      : (safeCurrentPage - 1) * safeItemsPerPage + 1;
  const endRecord =
    safeTotalItems === 0
      ? 0
      : Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems);

  const pageNumbers = getPageNumbers(safeCurrentPage, safeTotalPages);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#D4D4D4] bg-white px-6 py-4 rounded-b-xl ${className}`}
    >
      {/* Records Count & Range Display */}
      <div className="text-sm text-gray-500 order-2 sm:order-1">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin inline-block" />
            Loading records...
          </span>
        ) : safeTotalItems === 0 ? (
          <span>Showing 0 of 0 records</span>
        ) : (
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {startRecord}–{endRecord}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {safeTotalItems}
            </span>{" "}
            records
          </span>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange && onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1 || isLoading}
          className="px-3.5 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer select-none"
          aria-label="Previous page"
        >
          Previous
        </button>

        {/* Direct Page Numbers (Desktop / Tablet) */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((p, idx) =>
            p === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-sm text-gray-400 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange && onPageChange(p)}
                disabled={isLoading}
                className={`min-w-9 h-9 px-3 text-sm font-medium rounded-lg border transition cursor-pointer flex items-center justify-center select-none ${
                  p === safeCurrentPage
                    ? "bg-[#010067] text-white border-[#010067] font-semibold shadow-sm"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
                aria-current={p === safeCurrentPage ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Compact Page Number on Mobile */}
        <span className="sm:hidden text-xs text-gray-600 px-2 font-medium">
          {safeCurrentPage} / {safeTotalPages}
        </span>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange && onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= safeTotalPages || isLoading}
          className="px-3.5 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer select-none"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

export default memo(Pagination);
