export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
  product?: T;
  products?: T[];
}