import * as mysql from 'mysql';

export function cleanParams(mysqlConnection: mysql.Connection) {
    return (req, res, next) => {
        Object.keys(req.body).map(key => {
            req.body[key] = mysqlConnection.escape(req.body[key]);
        });
        next();
    }
}