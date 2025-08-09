import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";

export const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httpRequest = {
            body: req.body,
            params: req.params,
            query: req.query,
            headers: req.headers,
            user: (req as any).user,
        };

        const HttpResponse = await controller.handle(httpRequest);

        res.status(HttpResponse.statusCode).json(HttpResponse.body);
    };
};