import db from '../models/index';
import { ISafeUsersData, ISafeUser } from "../types";
import {IUser} from "../models/UserModel";

interface UsersReturnData {
    message: string;
    success: boolean;
    data?: ISafeUsersData;
    statusCode?: number;
}

export default class UsersService {
    constructor(
        public readonly id?: number,
        public readonly phone?: string,
        public readonly firstname?: string,
        public readonly lastname?: string,
        public readonly email?: string
    ) {
    }

    public async getUsers(): Promise<UsersReturnData> {
        try {
            const usersFromDb = await db.User.findAll({include: 'admin'});
            if (!usersFromDb)
                return ({ message: 'No users found', success: false });
            else {
                const data = this.prepareData(usersFromDb);
                return ({message: 'test', success: true, data: data});
            }
        } catch(e) {
            console.log(e);
            return ({ message: 'An error occurred', success: false });
        }
    }

    public async getUser(user_id: number): Promise<UsersReturnData> {
        if (!user_id) {
            return ({ message: 'User id was not provided', success: false })
        } else {
            try {
                const userFromDb = await db.User.findOne({where: {id: user_id}});
                if (!userFromDb)
                    return ({ message: 'user was not found', success: false });
                else {
                    const data = this.prepareData([userFromDb]);
                    return ({message: 'User found', success: true, data: data});
                }
            } catch(e) {
                console.log(e);
                return ({ message: 'An error occurred', success: false });
            }
        }
    }

    private prepareData(users: IUser[]): ISafeUsersData {
        if (users.length == 1) {
            const unsafe_user = users.pop();
            let isAdmin = false;
            if (unsafe_user.admin)
                isAdmin = true;
            const data: ISafeUsersData = {
                user: {
                    id: unsafe_user.id,
                    phone: unsafe_user.phone,
                    email: unsafe_user.email,
                    firstname: unsafe_user.firstname,
                    lastname: unsafe_user.lastname,
                    isAdmin: isAdmin
                }
            }
            return data;
        } else {
            const data: ISafeUsersData = {
                users: users.map(unsafe_data => {
                    let isAdmin = false;
                    if (unsafe_data.admin)
                        isAdmin = true;
                    return {
                        id: unsafe_data.id,
                        phone: unsafe_data.phone,
                        email: unsafe_data.email,
                        firstname: unsafe_data.firstname,
                        lastname: unsafe_data.lastname,
                        isAdmin: isAdmin
                    };
                })
            }
            return data;
        }
    }
}