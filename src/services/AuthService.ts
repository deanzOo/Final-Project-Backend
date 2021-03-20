import db from '../models/index';
import * as bcrypt from 'bcrypt';
import {ISafeData, ISafeUser} from "../types";
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

interface AuthReturnData {
    message: string;
    success: boolean;
    data?: object;
}

export default class AuthService {
    constructor(
        public readonly session_key?: string,
        public readonly phone?: string,
        public readonly password?: string,
        public readonly firstname?: string,
        public readonly lastname?: string,
        public readonly email?: string
    ) {
    }

    public async login(): Promise<AuthReturnData> {
        try {
            if (this.session_key) {
                const tokenPayload = jwt.verify(this.session_key, config.ACCESS_TOKEN_SECRET);
                const data = this.prepareData(tokenPayload.safeUser, this.session_key);
                return ({ message: 'Successfully logged in', success: true, data: data.user});
            } else {
                return this.handleLogin();
            }
        } catch(e) {
            if (e instanceof jwt.JsonWebTokenError) {
                return this.handleLogin();
            } else {
                console.log(e);
                return ({ message: 'An error occurred', success: false });
            }
        }
    }

    public async handleLogin(): Promise<AuthReturnData> {
        const userFromDb = await db.User.findOne({where: { phone: this.phone }});
        if (!userFromDb)
            return ({ message: 'No such user', success: false });
        else {
            const isPasswordEqual = await bcrypt.compare(this.password, userFromDb.password);
            if (isPasswordEqual) {
                const safeUser: ISafeUser = {
                    id: userFromDb.id,
                    phone: userFromDb.phone,
                    email: userFromDb.email,
                    firstname: userFromDb.firstname,
                    lastname: userFromDb.lastname
                }
                const token = jwt.sign(
                    { safeUser },
                    config.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30d' }
                );
                const data = this.prepareData(userFromDb, token);
                return({ message: 'Successfully logged in', success: true, data: data.user });
            } else {
                return({ message: 'Invalid password', success: false });
            }
        }
    }

    public async register(): Promise<AuthReturnData> {
        try {
            if (this.session_key) {
                console.log('session key', this.session_key);
                const tokenPayload = jwt.verify(this.session_key, config.ACCESS_TOKEN_SECRET);
                const data = this.prepareData(tokenPayload.safeUser, this.session_key);
                return ({message: 'Successfully logged in', success: true, data: data.user });
            } else {
                const userFromDb = await db.User.findOne({ where: { phone: this.phone }});
                if (!userFromDb) {
                    const hashedPassword = await bcrypt.hash(this.password, 10);
                    const createdUser = await db.User.create({
                        phone: this.phone,
                        password: hashedPassword,
                        firstname: this?.firstname,
                        lastname: this?.lastname,
                        email: this?.email
                    });
                    const safeUser: ISafeUser = {
                        id: createdUser.id,
                        phone: createdUser.phone,
                        email: createdUser.email,
                        firstname: createdUser.firstname,
                        lastname: createdUser.lastname
                    }
                    const token = jwt.sign({ safeUser }, config.ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
                    const data = this.prepareData(createdUser, token);
                    return({ message: 'Successfully registered', success: true, data: data.user });
                } else {
                    return({ message: 'User already exists', success: false });
                }
            }
        } catch(e) {
            console.log(e);
            return ({ message: 'An error occurred', success: false });
        }
    }

    private prepareData(user: ISafeUser, session_key: string): ISafeData {
        const data: ISafeData = {
            user: {
                id: user.id,
                phone: user.phone,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                session_key: session_key
            },
        };

        return data;
    }
}