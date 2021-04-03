import Controller, {Methods} from "../types/Controller";
import {NextFunction, Request, Response} from "express";
import AuthService from "../services/AuthService";

export default class AuthController extends Controller {
    path = '/auth';
    routes = [
        {
            path: '/',
            method: Methods.POST,
            handler: this.handleLogin,
            localMiddleware: []
        },
        {
            path: '/register',
            method: Methods.POST,
            handler: this.handleRegister,
            localMiddleware: []
        }
    ];

    constructor(highLevelMiddleware?: Array<(req: Request, res: Response, next: NextFunction) => void>) {
        super(highLevelMiddleware);
    }

    async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {phone, password} = req.body;
            const authService = new AuthService(phone, password);
            let user_data = await authService.login();
            if (user_data.success) {
                super.sendSuccess(res, user_data.data!, user_data.message);
            } else {
                super.sendError(res, user_data.message, user_data.statusCode);
            }
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async handleRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (req.body?.user) {
            super.sendSuccess(res, req.body.user)
        } else {
            try {
                const {phone, password, firstname, lastname, email} = req.body;
                const authService = new AuthService(phone, password, firstname, lastname, email);
                const data = await authService.register();
                if (data.success) {
                    super.sendSuccess(res, data.data!, data.message);
                } else {
                    super.sendError(res, data.message, data.statusCode);
                }
                ;
            } catch (e) {
                console.log(e);
                super.sendError(res);
            }
        }
    };
}