import Controller, {Methods} from "../types/Controller";
import {NextFunction, Request, Response} from "express";
import AdminsService from "../services/AdminsService";

export default class AdminsController extends Controller {
    path = '/admins';
    routes = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getAdmins,
            localMiddleware: []
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

    async getAdmins(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.body;
            const userService = new AdminsService(id);
            const data = await userService.getAdmins();
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