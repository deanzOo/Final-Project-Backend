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
            localMiddleware: []
        },
        // {
        //     path: '/',
        //     method: Methods.POST,
        //     handler: this.createUser,
        //     localMiddleware: []
        // },
        {
            path: `/:id`,
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
            const id = req.query?.id;
            const search = req.query?.search;
            const userService = new UsersService();

            if (id && typeof id === "string") {
                const userData = await userService.getUser(parseInt(id));
                if (userData.success)
                    super.sendSuccess(res, userData.data!, userData.message);
                else
                    super.sendError(res, userData.message);
            }
            else if (search && typeof search === "string") {
                const usersData = await userService.getUsers(search);
                if (usersData.success) {
                    super.sendSuccess(res, usersData.data!, usersData.message);
                } else {
                    super.sendError(res, usersData.message);
                }
            } else {
                const usersData = await userService.getUsers();
                if (usersData.success) {
                    super.sendSuccess(res, usersData.data!, usersData.message);
                } else {
                    super.sendError(res, usersData.message);
                }
            }
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params?.id);
            const {phone, firstname, lastname, email} = req.body;
            const userService = new UsersService();
            const data = await userService.updateUser(id, phone, firstname, lastname, email);
            if (data.success) {
                super.sendSuccess(res, data.data!, data.message);
            } else
                super.sendError(res, data.message);
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

}