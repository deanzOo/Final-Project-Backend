import * as express from "express";
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import Middleware from "./Middleware";
import db from "../models";

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

    public CheckIsAdmin() {
        return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const user = req.body?.user;
            if (user) {
                try {
                    const admin = await db.Admin.findOne({where: {user_id: user.id}});
                    if (admin)
                        req.body.user.isAdmin = true;
                    next();
                } catch (e) {
                    console.log(e);
                    super.sendError(res);
                }
            } else
                next();
        }
    }

    public AdminGuardian() {
        return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const user = req.body?.user;
            if (user) {
                try {
                    const admin = await db.Admin.findOne({where: {user_id: user.id}});
                    if (admin) {
                        req.body.user.isAdmin = true;
                        next();
                    }
                    else
                        super.sendError(res, 'Unauthorized');
                } catch (e) {
                    console.log(e);
                    super.sendError(res);
                }
            } else
                super.sendError(res, 'Unauthorized');
        }
    }
}