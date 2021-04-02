import * as express from 'express';
import config from './config/config';
import {json, urlencoded} from 'body-parser';
import * as cors from 'cors';
import db from './models/index';

import Server from "./types/Server";
import Controller from "./types/Controller";

import AuthController from "./controllers/AuthController";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import UsersController from "./controllers/UsersController";
import AdminsController from "./controllers/AdminsController";

const authMiddleware = new AuthMiddleware();

const app: express.Application = express();
const server: Server = new Server(app, db.sequelize, config.server.port);

const controllers: Array<Controller> = [
    new AuthController(),
    new UsersController(),
    new AdminsController([
        authMiddleware.AdminGuardian()
    ])
];

const globalMiddleware: Array<express.RequestHandler> = [
    urlencoded({ extended: false }),
    json(),
    cors({ credentails: true, origin: true }),
    authMiddleware.CheckAuthHeader(),
    authMiddleware.CheckIsAdmin()
]

Promise.resolve()
    .then(() => server.initDatabase())
    .then(() => {
        server.loadMiddleware(globalMiddleware);
        server.loadControllers(controllers);
        server.run();
    })