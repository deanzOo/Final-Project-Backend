import * as express from 'express';
import config from './config/config';
import {json, urlencoded} from 'body-parser';
import * as cors from 'cors';
import db from './models/index';

import Server from "./types/Server";
import Controller from "./types/Controller";

import AuthController from "./controllers/AuthController";

const app: express.Application = express();
const server: Server = new Server(app, db.sequelize, config.server.port);

const controllers: Array<Controller> = [
    new AuthController(),
];

const globalMiddleware: Array<express.RequestHandler> = [
    urlencoded({ extended: false }),
    json(),
    cors({ credentails: true, origin: true })
]

Promise.resolve()
    .then(() => server.initDatabase())
    .then(() => {
        server.loadMiddleware(globalMiddleware);
        server.loadControllers(controllers);
        server.run();
    })