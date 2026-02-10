interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface ApiError {
  message: string;
}
