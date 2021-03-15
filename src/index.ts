import * as express from 'express';
import * as mysql from 'mysql';
import config from './config/config';
import * as bodyParser from 'body-parser';
import * as NodeCache from 'node-cache';
import { ContainerBuilder } from "node-dependency-injection";
import * as morgan from 'morgan';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';

const privateKey = fs.readFileSync('~/etc/ssl/private/ssl-cert-snakeoil.key')
const certificate = fs.readFileSync('~/etc/ssl/certs/ssl-cert-snakeoil.pem')

const credentials = {key: privateKey, cert: certificate};

import { cleanParams } from './library/validations';

import Api from "./api/api";

const app: express.Express = express();
const port = config.server.port;
const hostname = config.server.hostname;

let DIContainer = new ContainerBuilder();

DIContainer
    .register('cache', NodeCache)
    .addArgument(config.sessionsCacheOptions);

DIContainer
    .register('db', mysql.createConnection)
    .addArgument(config.db);

try {
    DIContainer.get('db').connect((err: mysql.MysqlError) => {
        if (err) {
            console.error('cant connect to db', config.db);
            throw err;
        }
    });

    app.get('/', (req, res) => {
        res.status(200).send();
    })

    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.use(cleanParams(DIContainer));

    app.use('/api', Api(DIContainer));

    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(8080, '0.0.0.0');
    httpsServer.listen(8443, '0.0.0.0');
    //
    // app.listen(port, hostname, () => {
    //     console.log( `Server listening at port ${ port }` );
    // });

}
catch (err) {
    console.error(err);
}