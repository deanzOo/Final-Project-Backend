import Controller, {Methods} from "../../types/Controller";
import {NextFunction, Request, Response} from "express";
import HyperparametersService from "../../services/HyperparametersService";
import * as express from "express";

export default class HyperparametersController extends Controller {
    path = '/';
    routes = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getHyperparams,
            localMiddleware: []
        },
        {
            path: `/`,
            method: Methods.POST,
            handler: this.createHyperparams,
            localMiddleware: []
        },
        {
            path: '/',
            method: Methods.DELETE,
            handler: this.deleteHyperparams,
            localMiddleware: []
        }
    ];
    subroutes = [];

    constructor(highLevelMiddleware?: Array<(req: express.Request, res: express.Response, next: express.NextFunction) => void>) {
        super(highLevelMiddleware);
    }

    async getHyperparams(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.query?.id;
            const hyperParamsService = new HyperparametersService();

            if (id && typeof id === "string") {
                const hyperParamsData = await hyperParamsService.getHyperparameters(parseInt(id));
                if (hyperParamsData.success)
                    super.sendSuccess(res, hyperParamsData.data!, hyperParamsData.message);
                else
                    super.sendError(res, hyperParamsData.message);
            } else {
                const hyperParamsData = await hyperParamsService.getHyperparameters();
                if (hyperParamsData.success) {
                    super.sendSuccess(res, hyperParamsData.data!, hyperParamsData.message);
                } else {
                    super.sendError(res, hyperParamsData.message);
                }
            }
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async createHyperparams(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                batch_size,
                learning_rate,
                img_h,
                img_w,
                channels,
                use_bias,
                dropout_rate,
                epochs,
                conv_padding,
                latent_dim
            } = req.body;
            const hyperParamsService = new HyperparametersService();
            const data = await hyperParamsService.createHyperParams(
                                                                batch_size,
                                                                learning_rate,
                                                                img_h,
                                                                img_w,
                                                                channels,
                                                                use_bias,
                                                                dropout_rate,
                                                                epochs,
                                                                conv_padding,
                                                                latent_dim);
            if (data.success) {
                super.sendSuccess(res, data.data!, data.message);
            } else
                super.sendError(res, data.message);
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async deleteHyperparams(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.body;
            const hyperParamsService = new HyperparametersService();
            const data = await hyperParamsService.deleteHyperParams(id);
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