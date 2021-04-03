import Controller, {Methods} from "../../types/Controller";
import {NextFunction, Request, Response} from "express";
import LogoService from "../../services/LogoService";
import * as express from "express";

export default class LogosController extends Controller {
    path = '/';
    routes = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getLogo,
            localMiddleware: []
        },
        {
            path: `/`,
            method: Methods.POST,
            handler: this.createLogo,
            localMiddleware: []
        },
        {
            path: '/',
            method: Methods.DELETE,
            handler: this.deleteLogo,
            localMiddleware: []
        }
    ];
    subroutes = [];

    constructor(highLevelMiddleware?: Array<(req: express.Request, res: express.Response, next: express.NextFunction) => void>) {
        super(highLevelMiddleware);
    }

    async getLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.query?.id;
            const logosService = new LogoService();

            if (id && typeof id === "string") {
                const logossData = await logosService.getLogos(parseInt(id));
                if (logossData.success)
                    super.sendSuccess(res, logossData.data!, logossData.message);
                else
                    super.sendError(res, logossData.message);
            } else {
                const logossData = await logosService.getLogos();
                if (logossData.success) {
                    super.sendSuccess(res, logossData.data!, logossData.message);
                } else {
                    super.sendError(res, logossData.message);
                }
            }
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async createLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id,
                width,
                height,
                channels,
                format,
                model_id,
                user_id,
                url
            } = req.body;
            const logosService = new LogoService();
            const data = await logosService.createLogo(
                width,
                height,
                channels,
                format,
                model_id,
                user_id,
                url
            );
            if (data.success) {
                super.sendSuccess(res, data.data!, data.message);
            } else
                super.sendError(res, data.message);
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async deleteLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.body;
            const logosService = new LogoService();
            const data = await logosService.deleteLogo(id);
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