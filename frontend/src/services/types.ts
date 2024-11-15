export type ErrorDetail = {
  domain?: string | null;
  reason?: string | null;
  message?: string | null;
  location?: string | null;
  locationType?: string | null;
  extendedHelp?: string | null;
  sendReport?: string | null;
};
export type ErrorInformation = {
  code?: number;
  detail?: string | null;
  non_field_errors?: string[] | null;
  errors?: ErrorDetail[] | null;
};
export type ErrorResponse = {
  apiVersion?: string | null;
  error?: ErrorInformation;
};
export type ApiResponse = {
  detail: string;
};

export type BaseFetchListParams = {
  search?: string ;
  limit?: number;
  offset?: number;
  sort?: string;
  include?: [];
};

export type PaginatedListData<T> = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
};
