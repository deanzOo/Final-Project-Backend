import * as express from 'express';
import * as mysql from 'mysql';
import config from './config/config';
import * as bodyParser from 'body-parser';
import * as NodeCache from 'node-cache';
import { ContainerBuilder } from "node-dependency-injection";
import * as morgan from 'morgan';

import { cleanParams } from './library/validations';

import Auth from './handlers/Auth';
import Hyperparameters from "./handlers/Hyperparameters";

const app: express.Express = express();
const port = config.server.port ?? 3000;

let DIContainer = new ContainerBuilder();

const sessionsCache = new NodeCache(config.sessionsCacheOptions);
DIContainer
    .register('cache', NodeCache)
    .addArgument(config.sessionsCacheOptions);

const mysqlConnection: mysql.Connection = mysql.createConnection(config?.db);
DIContainer
    .register('db', mysql.createConnection)
    .addArgument(config.db);

try {
    mysqlConnection.connect((err: mysql.MysqlError) => {
        if (err)
            throw err;
    });

    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.use(cleanParams(DIContainer));

    app.use('/auth', Auth(DIContainer));
    app.use('/hypers', Hyperparameters(DIContainer));

    app.listen(port, () => {
        console.log( `Server listening at port ${ port }` );
    });

}
catch (err) {
    console.error(err);
    console.error('Server failed to start');
    console.log('Should log this')
}