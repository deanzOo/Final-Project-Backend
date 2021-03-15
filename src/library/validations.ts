import * as mysql from 'mysql';
import { http_codes } from '../config/errors';
import {ContainerBuilder} from "node-dependency-injection";

export function cleanParams(DIContainer: ContainerBuilder) {
    return (req, res, next) => {
        Object.keys(req.body).map(key => {
            req.body[key] = DIContainer.get('db').escape(req.body[key]);
        });
        next();
    }
}

export function clientGuardian(DIContainer: ContainerBuilder) {
    return (req, res, next) => {
        const cache = DIContainer.get('cache');
        const user = cache.get(req.headers?.Authorization ?? '');
        if (!user) {
            const db = DIContainer.get('db');
            db.query(`SELECT user_id FROM users_session WHERE session_key = ${db.escape(req.headers?.Authorization)}`, (error: mysql.MysqlError, sesseion_check: any) => {
                if (error) {
                    res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                } else {
                    if (!sesseion_check?.[0]?.user_id) {
                        res.status(http_codes.BAD_REQUEST).send();
                    } else {
                        db.query(`SELECT id, firstname, lastname, phone FROM users where id = ${sesseion_check?.[0]?.user_id}`, (error: mysql.MysqlError, user_results: any) => {
                            if (error) {
                                res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                            } else if (!user_results?.[0]) {
                                res.status(http_codes.BAD_REQUEST).send();
                            } else {
                                req.body.user = user_results?.[0];
                                next();
                            }
                        })
                    }
                }
            });
        } else {
            req.body.user = user;
            next();
        }
    }
}