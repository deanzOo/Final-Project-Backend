import Controller, {Methods} from "../../types/Controller";
import {NextFunction, Request, Response} from "express";
import ClassificationService from "../../services/ClassificationService";
import * as express from "express";

export default class ClassificationsController extends Controller {
    path = '/';
    routes = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getClassifications,
            localMiddleware: []
        },
        {
            path: `/`,
            method: Methods.POST,
            handler: this.createClassification,
            localMiddleware: []
        },
        {
            path: '/',
            method: Methods.DELETE,
            handler: this.deleteClassification,
            localMiddleware: []
        }
    ];
    subroutes = [];

    constructor(highLevelMiddleware?: Array<(req: express.Request, res: express.Response, next: express.NextFunction) => void>) {
        super(highLevelMiddleware);
    }

    async getClassifications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.query?.id;
            const classificationsService = new ClassificationService();

            if (id && typeof id === "string") {
                const classificationsData = await classificationsService.getClassifications(parseInt(id));
                if (classificationsData.success)
                    super.sendSuccess(res, classificationsData.data!, classificationsData.message);
                else
                    super.sendError(res, classificationsData.message);
            } else {
                const classificationsData = await classificationsService.getClassifications();
                if (classificationsData.success) {
                    super.sendSuccess(res, classificationsData.data!, classificationsData.message);
                } else {
                    super.sendError(res, classificationsData.message);
                }
            }
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async createClassification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                name
            } = req.body;
            const classificationsService = new ClassificationService();
            const data = await classificationsService.createClassification(name);
            if (data.success) {
                super.sendSuccess(res, data.data!, data.message);
            } else
                super.sendError(res, data.message);
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async deleteClassification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.body;
            const classificationsService = new ClassificationService();
            const data = await classificationsService.deleteClassification(id);
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