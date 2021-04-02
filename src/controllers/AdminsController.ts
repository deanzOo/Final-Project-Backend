import Controller, {Methods} from "../types/Controller";
import {NextFunction, Request, Response} from "express";
import AdminsService from "../services/AdminsService";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import AdminsUsersController from "./Admins/AdminsUsersController";
import UsersService from "../services/UsersService";

const authMW = new AuthMiddleware();
const adminGuard = authMW.AdminGuardian();

export default class AdminsController extends Controller {
    path = '/admins';
    routes = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getAdmins,
            localMiddleware: []
        },
        {
            path: '/:id',
            method: Methods.POST,
            handler: this.createAdmin,
            localMiddleware: []
        },
        {
            path: '/:id',
            method: Methods.DELETE,
            handler: this.deleteAdmin,
            localMiddleware: []
        }
    ];
    subroutes = [
        {
            path: '/users',
            controller: new AdminsUsersController()
        }
    ];
    highLevelMiddleware = [
        adminGuard
    ];

    constructor(highLevelMiddleware?: Array<(req: Request, res: Response, next: NextFunction) => void>) {
        super(highLevelMiddleware);
    }

    async getAdmins(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.body;
            const adminService = new AdminsService(id);
            const data = await adminService.getAdmins();
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

    async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.body;
            const adminService = new AdminsService(id);
            const createResult = await adminService.makeAdmin(id);
            if (createResult.success) {
                super.sendSuccess(res, createResult.data!, createResult.message);
            } else {
                super.sendError(res, createResult.message);
            }
        } catch (e) {
            console.log(e);
            super.sendError(res);
        }
    }

    async deleteAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params?.id);
            const adminsService = new AdminsService();
            const data = await adminsService.deleteAdmin(id);
            if (data.success)
                super.sendSuccess(res, data.data!, data.message);
            else
                super.sendError(res, data.message);
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

}