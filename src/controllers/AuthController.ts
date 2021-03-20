import Controller, {Methods} from "../types/Controller";
import {NextFunction, Request, Response} from "express";
import UserService from "../services/UserService";

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
        try {
            const session_key = req.headers?.authorization;
            const {phone, password} = req.body;
            const userService = new UserService(session_key, phone, password);
            const data = await userService.login();
            if (data.success) {
                super.sendSuccess(res, data.data!, data.message);
            } else {
                super.sendError(res, data.message);
            }
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async handleRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const session_key = req.headers?.authorization;
            const { phone, password, firstname, lastname, email } = req.body;
            const userService = new UserService(session_key, phone, password, firstname, lastname, email);
            const data = await userService.register();
            if (data.success) {
                super.sendSuccess(res, data.data!, data.message);
            } else {
                super.sendError(res, data.message);
            };
        } catch(e) {
            console.log(e);
            super.sendError(res);
        }
    };
}