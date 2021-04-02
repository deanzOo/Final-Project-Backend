import Controller, {Methods} from "../../types/Controller";
import {NextFunction, Request, Response} from "express";
import DatasetService from "../../services/DatasetService";
import * as express from "express";

export default class DatasetsController extends Controller {
    path = '/';
    routes = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getDatasets,
            localMiddleware: []
        },
        {
            path: `/`,
            method: Methods.POST,
            handler: this.createDataset,
            localMiddleware: []
        },
        {
            path: '/',
            method: Methods.DELETE,
            handler: this.deleteDataset,
            localMiddleware: []
        }
    ];
    subroutes = [];

    constructor(highLevelMiddleware?: Array<(req: express.Request, res: express.Response, next: express.NextFunction) => void>) {
        super(highLevelMiddleware);
    }

    async getDatasets(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.query?.id;
            const datasetsService = new DatasetService();

            if (id && typeof id === "string") {
                const datasetsData = await datasetsService.getDatasets(parseInt(id));
                if (datasetsData.success)
                    super.sendSuccess(res, datasetsData.data!, datasetsData.message);
                else
                    super.sendError(res, datasetsData.message);
            } else {
                const datasetsData = await datasetsService.getDatasets();
                if (datasetsData.success) {
                    super.sendSuccess(res, datasetsData.data!, datasetsData.message);
                } else {
                    super.sendError(res, datasetsData.message);
                }
            }
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async createDataset(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                image_format,
                location,
                size,
                name
            } = req.body;
            const datasetsService = new DatasetService();
            const data = await datasetsService.createDataset(
                image_format,
                location,
                size,
                name);
            if (data.success) {
                super.sendSuccess(res, data.data!, data.message);
            } else
                super.sendError(res, data.message);
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async deleteDataset(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.body;
            const datasetsService = new DatasetService();
            const data = await datasetsService.deleteDataset(id);
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