import * as mysql from 'mysql';

export function cleanParams(mysqlConnection: mysql.Connection) {
    return (req, res, next) => {
        req.body = {...Object.keys(req.body).map(key => {mysqlConnection.escape(req.body[key]);})};
        next();
    }
}