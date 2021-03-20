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

    constructor() {
        super();
    }

    async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (req.body?.user) {
            super.sendSuccess(res, req.body.user);
        } else {
            try {
                const {phone, password} = req.body;
                const authService = new AuthService(phone, password);
                const data = await authService.login();
                if (data.success) {
                    super.sendSuccess(res, data.data!, data.message);
                } else {
                    super.sendError(res, data.message, data.statusCode);
                }
            } catch (e) {
                console.log(e);
                super.sendError(res)
            }
        }
    }

    async handleRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { phone, password, firstname, lastname, email } = req.body;
            const userService = new AuthService(phone, password, firstname, lastname, email);
            const data = await userService.register();
            if (data.success) {
                super.sendSuccess(res, data.data!, data.message);
            } else {
                super.sendError(res, data.message, data.statusCode);
            };
        } catch(e) {
            console.log(e);
            super.sendError(res);
        }
    };
}