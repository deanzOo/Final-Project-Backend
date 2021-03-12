import * as express from 'express';
import * as mysql from 'mysql';
import config from './config/config';
import * as bodyParser from 'body-parser';

import Auth from './handlers/Auth';

const app: express.Express = express();
const port = config?.server?.port ?? 3000;

const mysqlConnection: mysql.Connection = mysql.createConnection(config?.db);

try {
    mysqlConnection.connect((err: mysql.MysqlError) => {
        if (err)
            throw err;
    });

    app.use(bodyParser.json());

    app.use('/auth', Auth(mysqlConnection));

    app.listen(port, () => {
        console.log( `Server listening at port ${ port }` );
    });

}
catch (err) {
    console.error(err);
    console.error('Server failed to start');
    console.log('Should log this')
}