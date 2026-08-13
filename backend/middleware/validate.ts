import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type ValidationTarget = "body" | "query" | "params";

/**
 * Middleware factory: validates a request property against a Zod schema.
 * On success, replaces the property with the parsed (coerced/defaulted) value.
 * On failure, passes the ZodError to the error handler.
 */
export function validate(schema: ZodSchema, target: ValidationTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      next(result.error);
      return;
    }

    // Replace with parsed/coerced values
    (req as any)[target] = result.data;
    next();
  };
}
