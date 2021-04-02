import * as express from "express";

export enum Methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

interface IRoute {
    path: string;
    method: Methods;
    handler: (req: express.Request, res: express.Response, next: express.NextFunction) => void | Promise<void>;
    localMiddleware: ((req: express.Request, res: express.Response, next: express.NextFunction) => void)[];
}

interface ISubRoute {
    path: string;
    controller: Controller
}


export default abstract class Controller {
    public router: express.Router = express.Router();
    public path: string;
    protected readonly routes: Array<IRoute> = [];
    protected readonly subroutes: Array<ISubRoute> = [];
    protected readonly highLevelMiddleware: Array<(req: express.Request, res: express.Response, next: express.NextFunction) => void> = [];
    constructor(highLevelMiddleware?: Array<(req: express.Request, res: express.Response, next: express.NextFunction) => void>) {
        this.router = express.Router();
        this.routes = [];
        this.subroutes = [];
        if (highLevelMiddleware)
            this.highLevelMiddleware = highLevelMiddleware;
    }

    private setRoutes = (): express.Router => {
        for (const route of this.routes) {
            for (const mw of route.localMiddleware) {
                this.router.use(route.path, mw);
            }
            switch (route.method) {
                case Methods.GET:
                    this.router.get(route.path, route.handler);
                    break;
                case Methods.POST:
                    this.router.post(route.path, route.handler);
                    break;
                case Methods.PUT:
                    this.router.put(route.path, route.handler);
                    break;
                case Methods.DELETE:
                    this.router.delete(route.path, route.handler);
                    break;
                default:
                    console.log('not a valid method for this controller');
                    break;
            }
        }

        return this.router;
    }

    private setSubRoutes = (): express.Router => {
        for (const subroute of this.subroutes) {
            for (const mw of this.highLevelMiddleware)
                subroute.controller.highLevelMiddleware.push(mw);
            this.router.use(subroute.path, subroute.controller.setup());
        }

        return this.router;
    }

    private setHigherLevelMiddleware = (): express.Router => {
        for (const mw of this.highLevelMiddleware) {
            for (let i = 0; i < this.routes.length ; i++) {
                this.routes[i].localMiddleware.push(mw)
            }
        }
        return this.router;
    }

    public setup = (): express.Router => {
        this.setHigherLevelMiddleware();
        this.setRoutes();
        this.setSubRoutes();
        return this.router;
    }

    protected sendSuccess(res: express.Response, data: object, message?: string): express.Response {
        return res.status(200).json(data);
    }

    protected sendError(res: express.Response, message?: string, statusCode?: number): express.Response {
        return res.status(statusCode ?? 500).json({
            message: message || 'internal server error'
        });
    }
}