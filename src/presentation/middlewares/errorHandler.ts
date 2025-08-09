import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            succes: false,
            error: error.message,
        });
        return
    }
}