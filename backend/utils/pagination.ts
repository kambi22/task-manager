export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Parse page/limit from query parameters and compute skip for Prisma.
 */
export function parsePagination(query: {
  page?: string | number;
  limit?: string | number;
}): PaginationParams {
  const page = Math.max(1, parseInt(String(query.page || "1"), 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(String(query.limit || "20"), 10) || 20)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Build pagination metadata from total count and current params.
 */
export function buildPaginationMeta(
  totalCount: number,
  params: PaginationParams
): PaginationMeta {
  const totalPages = Math.ceil(totalCount / params.limit);

  return {
    page: params.page,
    limit: params.limit,
    totalCount,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPrevPage: params.page > 1,
  };
}
