export interface DefaultPagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number; 
}

export interface DefaultPaginationRequest {
  page: number;
  limit: number;
}