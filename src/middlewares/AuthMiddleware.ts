import * as express from "express";
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import Middleware from "./Middleware";

export default class AuthMiddleware extends Middleware{
    public CheckAuthHeader() {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const session_key = req.headers?.authorization;
            if (session_key) {
                try {
                    const tokenPayload = jwt.verify(session_key, config.ACCESS_TOKEN_SECRET);
                    if (tokenPayload.exp < Date.now()) {
                        req.body.user = tokenPayload.safeUser;
                        next();
                    } else
                        super.sendError(res, 'Credentials expired');
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError)
                        next();
                    else {
                        console.log(e);
                        super.sendError(res);
                    }
                }
            } else
                next();
        }
    }
}