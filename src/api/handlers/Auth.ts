import * as express from 'express';
import * as mysql from 'mysql';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
// @ts-ignore
import { errors, http_codes} from '../../config/errors';
import * as NodeCache from 'node-cache';
import {ContainerBuilder} from "node-dependency-injection";

function Auth (DIContainer: ContainerBuilder) {
    const router: express.Router = express.Router();

    /**
     * /api/auth
     */
    router.post('/', (req: express.Request, res: express.Response, next) => {
        DIContainer.get('db').query(
            `SELECT * FROM users WHERE phone = "${req.body?.phone}"`,
            (error: mysql.MysqlError, select_results: any, fields: mysql.FieldInfo[]) => {
            if (error) {
                console.error('should log this');
                console.error(error);
                res.status(http_codes.INTERNAL_SERVER_ERROR).send();
            } else {
                /** compare password given by client, to password contained in DB
                 * in case we didnt find any user by the phone provided, or for whatever reason,
                 * the db resulted in no rows then the 'comparison' fails
                 */
                if (!select_results?.[0])
                    res.status(http_codes.NOT_FOUND).send()
                else {
                    bcrypt.compare(req.body?.password, select_results?.[0]?.password, function (err, compare_result) {
                        if (err) {
                            res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                        }
                        else if (compare_result == true) {
                            /**
                             * If the passwords match, create or update a session key for the user
                             */
                            const userId: number = parseInt(select_results?.[0]?.id);
                            const session_key = userId + '__' + Date.now() + '__' + crypto.randomBytes(20).toString('hex');

                            const data = {
                                user_id: userId,
                                session_key: session_key,
                            };
                            DIContainer.get('db').query(
                                'INSERT INTO users_session SET ?',
                                data,
                                (error: mysql.MysqlError, insert_results: any, fields: mysql.FieldInfo[]) => {
                                    if (error) {
                                        if (error.errno == 1062) { // duplicate entry
                                            DIContainer.get('db').query(
                                                `UPDATE users_session SET session_key = "${session_key}" WHERE user_id = ${userId}`,
                                                (error: mysql.MysqlError, update_results: any, fields: mysql.FieldInfo[]) => {
                                                    if (error) {
                                                        res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                                                    } else if (update_results.affectedRows === 0) { // bad params probably
                                                        res.status(http_codes.BAD_REQUEST).send();
                                                    } else {
                                                        DIContainer.get('cache').set(session_key, select_results[0])
                                                        res.status(http_codes.OK).send({session_key: session_key});
                                                    }
                                                });
                                        } else {
                                            res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                                        }
                                    } else if (insert_results.affectedRows === 0) { // bad params probably
                                        res.status(http_codes.BAD_REQUEST).send();
                                    } else {
                                        DIContainer.get('cache').set(session_key, select_results[0])
                                        res.status(http_codes.OK).send({session_key: session_key});
                                    }
                                });
                        } else {
                            res.status(http_codes.UNAUTHORIZED).send();
                        }
                    });
                }
            }
        });
    });

    /**
     * /api/auth/register
     */
    router.post('/register', (req: express.Request, res: express.Response, next) => {
        const regexpr = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/g;
        const validPass = req.body?.password.match(regexpr);
        if (!validPass)
            res.status(http_codes.BAD_REQUEST).send({'message': 'Password must contain at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character [ @ $ ! % * ? & ]'});
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                console.error('should log this');
                console.error(err);
                res.status(http_codes.INTERNAL_SERVER_ERROR);
            } else {
                req.body.password = hash;
                DIContainer.get('db').query(`INSERT INTO users SET ?`, req.body, (error: mysql.MysqlError, results: any, fields: mysql.FieldInfo[]) => {
                    if (error) {
                        console.error('should log this');
                        console.error(error);
                        res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                    } else if (results.affectedRows === 0) {
                        res.status(http_codes.BAD_REQUEST).send();
                    } else {
                        const userId: number = results.insertId;
                        const session_key = userId + '__' + Date.now() + '__' + crypto.randomBytes(20).toString('hex');
                        const data = {
                            user_id: userId,
                            session_key: session_key,
                        };
                        DIContainer.get('db').query('INSERT INTO users_session SET ?', data, (error: mysql.MysqlError, session_result: any, fields: mysql.FieldInfo[]) => {
                            if (error) {
                                console.error('should log this');
                                console.error(error);
                                res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                            } else if (results.affectedRows === 0) {
                                res.status(http_codes.BAD_REQUEST).send();
                            } else
                                res.status(http_codes.OK).send({'session_key': session_key});
                        })
                    }
                });

            }
        });
        }
    });

    return router;
}

export default Auth;