import * as express from "express";

export default class Middleware {
    protected sendSuccess(res: express.Response, data: object, message?: string): express.Response {
        return res.status(200).json(data);
    }

    protected sendError(res: express.Response, message?: string): express.Response {
        return res.status(500).json({
            message: message || 'internal server error'
        });
    }
}