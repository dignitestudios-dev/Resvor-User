/**
 * Generate pagination page items with ellipses when needed.
 * Example outputs:
 *  - <= 7 pages: [1, 2, 3, 4, 5, 6, 7]
 *  - page <= 4:  [1, 2, 3, 4, 5, 'ellipsis', 10]
 *  - page >= 7:  [1, 'ellipsis', 6, 7, 8, 9, 10]
 *  - middle:     [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 */
export function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}
