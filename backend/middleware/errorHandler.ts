import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import ApiError from "../utils/ApiError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[Error] ${err.name}: ${err.message}`);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const issues = err.issues || (err as any).errors || [];
    const errors = issues.map(
      (e: any) => `${Array.isArray(e.path) ? e.path.join(".") : e.path}: ${e.message}`
    );
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  // Handle Multer upload errors
  if (err.name === "MulterError") {
    res.status(400).json({
      success: false,
      message: `File upload failed: ${err.message}`,
      errors: [err.message],
    });
    return;
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: [],
  });
}
