import Controller, {Methods} from "../types/Controller";
import {NextFunction, Request, Response} from "express";
import UsersService from "../services/UsersService";
import AuthMiddleware from '../middlewares/AuthMiddleware';

const authMW = new AuthMiddleware();
const adminGuard = authMW.AdminGuardian();

export default class UsersController extends Controller {
    path = '/users';
    routes = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getUsers,
            localMiddleware: [adminGuard]
        },
        // {
        //     path: '/',
        //     method: Methods.POST,
        //     handler: this.createUser,
        //     localMiddleware: []
        // },
        {
            path: '/{id}',
            method: Methods.PUT,
            handler: this.updateUser,
            localMiddleware: []
        },
        // {
        //     path: '/{id}',
        //     method: Methods.DELETE,
        //     handler: this.deleteUser,
        //     localMiddleware: []
        // }
    ];

    constructor() {
        super();
    }

    async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id, phone, firstname, lastname, email} = req.body;
            const userService = new UsersService();
            if (id) {
                const data = await userService.getUser(id);
                if (data.success) {
                    super.sendSuccess(res, data.data!, data.message);
                } else {
                    super.sendError(res, data.message);
                }
            }
            else if (!phone && !firstname && !lastname && !email) {
                const data = await userService.getUsers();
                if (data.success) {
                    super.sendSuccess(res, data.data!, data.message);
                } else {
                    super.sendError(res, data.message);
                }
            } else {
                    let data = [];
                    let messages = [];
                    if (phone) {
                        const temp_data = await userService.getUsers(phone);
                        if (temp_data.success) {
                            data.push(temp_data.data);
                            messages.push(temp_data.message)
                        } else
                            super.sendError(res, temp_data.message);
                    }
                    if (firstname) {
                        const temp_data = await userService.getUsers(firstname);
                        if (temp_data.success) {
                            data.push(temp_data.data);
                            messages.push(temp_data.message)
                        } else
                            super.sendError(res, temp_data.message);
                    }
                    if (lastname) {
                        const temp_data = await userService.getUsers(lastname);
                        if (temp_data.success) {
                            data.push(temp_data.data);
                            messages.push(temp_data.message)
                        } else
                            super.sendError(res, temp_data.message);
                    }
                    if (email) {
                        const temp_data = await userService.getUsers(email);
                        if (temp_data.success) {
                            data.push(temp_data.data);
                            messages.push(temp_data.message)
                        } else
                            super.sendError(res, temp_data.message);
                    }
                    super.sendSuccess(res, data, messages.join('\n'));
                }
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id, phone, firstname, lastname, email} = req.body;
            const userService = new UsersService();
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

}