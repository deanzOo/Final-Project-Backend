import * as express from 'express';
import * as mysql from 'mysql';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
// @ts-ignore
import { errors, http_codes} from '../config/errors';
import { cleanParams } from '../library/Validations';

function Auth (mysqlConnection: mysql.Connection) {
    const router: express.Router = express.Router();

    /**
     * /api/auth
     */
    router.post('/', (req: express.Request, res: express.Response) => {
        mysqlConnection.query(
            `SELECT id, password FROM users WHERE phone = '${req.body?.phone}'`,
            (error: mysql.MysqlError, results: any, fields: mysql.FieldInfo[]) => {
            if (error) {
                console.error('should log this');
                console.error(error);
                res.status(http_codes.INTERNAL_SERVER_ERROR).send();
            } else {
                /** compare password given by client, to password contained in DB
                 * in case we didnt find any user by the phone provided, or for whatever reason,
                 * the db resulted in no rows then the 'comparison' fails
                 */
                bcrypt.compare(req.body?.password, results?.[0].password, function (err, result) {
                    if (err) {
                        console.error('should log this');
                        console.error(error);
                        res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                    }
                    if (result == true) {
                        /**
                         * If the passwords match, create or update a session key for the user
                         */
                        const session_key = crypto.randomBytes(20).toString('hex');

                        const data = {
                            user_id: parseInt(results?.[0]?.id),
                            session_key: session_key,
                        };
                        mysqlConnection.query(
                            'INSERT INTO users_session SET ?',
                            data,
                            (error: mysql.MysqlError, results: any, fields: mysql.FieldInfo[]) => {
                                if (error) {
                                    console.error('should log this');
                                    console.error(error);
                                    res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                                } else if (results.affectedRows === 0) { // probably theres already a record with this user_id
                                    mysqlConnection.query(
                                        `UPDATE users_session SET session_key = ${session_key} WHERE user_id = ${parseInt(results?.[0]?.id)}`,
                                        (error: mysql.MysqlError, update_results: any, fields: mysql.FieldInfo[]) => {
                                            if (error) {
                                                console.error('should log this');
                                                console.error(error);
                                                res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                                            } else
                                                res.status(http_codes.OK).send({session_key: session_key});
                                        });
                                } else
                                    res.status(http_codes.OK).send({session_key: session_key});
                            });
                    } else {
                        console.info('Unauthorized attempt. should log this.');
                        res.status(http_codes.UNAUTHORIZED).send();
                    }
                });
            }
        });
    });

    /**
     * /api/auth/register
     */
    router.post('/register', (req: express.Request, res: express.Response, next) => {
        cleanParams(req, res, next, mysqlConnection);
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
                mysqlConnection.query(`INSERT INTO users SET ?`, req.body, (error: mysql.MysqlError, results: any, fields: mysql.FieldInfo[]) => {
                    if (error) {
                        console.error('should log this');
                        console.error(error);
                        res.status(http_codes.INTERNAL_SERVER_ERROR).send();
                    } else if (results.affectedRows === 0) {
                        res.status(http_codes.BAD_REQUEST).send();
                    } else {
                        const session_key = crypto.randomBytes(20).toString('hex');
                        const data = {
                            user_id: parseInt(results?.[0]?.id),
                            session_key: session_key,
                        };
                        mysqlConnection.query('INSERT INTO users_session SET ?', data, (error: mysql.MysqlError, session_result: any, fields: mysql.FieldInfo[]) => {
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