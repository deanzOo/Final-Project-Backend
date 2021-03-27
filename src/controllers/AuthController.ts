import Controller, {Methods} from "../types/Controller";
import {NextFunction, Request, Response} from "express";
import AuthService from "../services/AuthService";
import AdminService from "../services/AdminsService";

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
                let user_data = await authService.login();
                if (user_data.success) {
                    const adminService = new AdminService(user_data.data.id);
                    console.log(adminService);
                    const adminData = await adminService.getAdmins();
                    if (adminData.success)
                        user_data.data.isAdmin = true;
                    super.sendSuccess(res, user_data.data!, user_data.message);
                } else {
                    super.sendError(res, user_data.message, user_data.statusCode);
                }
            } catch (e) {
                console.log(e);
                super.sendError(res)
            }
        }
    }

    async handleRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (req.body?.user) {
            super.sendSuccess(res, req.body.user)
        } else {
            try {
                const {phone, password, firstname, lastname, email} = req.body;
                const userService = new AuthService(phone, password, firstname, lastname, email);
                const data = await userService.register();
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