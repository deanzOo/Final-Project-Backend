import Controller, {Methods} from "../types/Controller";
import {NextFunction, Request, Response} from "express";
import UsersService from "../services/UsersService";
import AuthMiddleware from '../middlewares/AuthMiddleware';

const authMW = new AuthMiddleware();

export default class UsersController extends Controller {
    path = '/users';
    routes = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getUsers,
            localMiddleware: [authMW.AdminGuardian()]
        },
        // {
        //     path: '/',
        //     method: Methods.POST,
        //     handler: this.createUser,
        //     localMiddleware: []
        // },
        // {
        //     path: '/{id}',
        //     method: Methods.PUT,
        //     handler: this.updateUser,
        //     localMiddleware: []
        // },
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
            const userService = new UsersService(id, phone, firstname, lastname, email);
            const data = await userService.getUsers();
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

}