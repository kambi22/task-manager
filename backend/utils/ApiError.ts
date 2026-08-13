class ApiError extends Error {
  statusCode: number;
  errors: string[];

  constructor(statusCode: number, message: string, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "ApiError";

    // Maintain proper stack trace
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, errors: string[] = []) {
    return new ApiError(400, message, errors);
  }

  static notFound(message: string = "Resource not found") {
    return new ApiError(404, message);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new ApiError(401, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }

  static internal(message: string = "Internal server error") {
    return new ApiError(500, message);
  }
}

export default ApiError;
