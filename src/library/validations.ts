import * as mysql from 'mysql';

export function cleanParams(req, res, next, mysqlConnection: mysql.Connection) {
    Object.keys(req.body).map(key => {
        req.body[key] = mysqlConnection.escape(req.body[key]);
    });
    next();
}