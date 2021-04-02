import {Application, RequestHandler} from "express";
import {Sequelize} from "sequelize";
import * as http from "http";
import Controller from './Controller'

export default class Server {
    private app: Application;
    private database: Sequelize;
    private readonly port: number;

    constructor(app: Application, database: Sequelize, port: number) {
        this.app = app;
        this.database = database;
        this.port = port;
    }

    public run(): http.Server {
        return this.app.listen(this.port, () => {
            console.log(`The server is running on port ${this.port}`);
        })
    }

    public loadMiddleware(middlewars: Array<RequestHandler>): void {
        middlewars.forEach(mw => {
            this.app.use(mw);
        })
    }

    public loadControllers(controllers: Array<Controller>) {
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.setup());
        })
    }

    public async initDatabase(): Promise<void> {
        try {
            await this.database.authenticate();
            console.log('Database is successfully authenticated')
        } catch (err) {
            console.log(err);
        }
    }
}