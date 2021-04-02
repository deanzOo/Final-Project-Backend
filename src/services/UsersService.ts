import db from '../models/index';
import { ISafeUsersData, ISafeUser } from "../types";
import {IUser} from "../models/UserModel";
import {Op} from "sequelize";

interface UsersReturnData {
    message: string;
    success: boolean;
    data?: ISafeUser [];
    statusCode?: number;
}

export default class UsersService {
    constructor(
    ) {
    }

    public async getUsers(search?: string):
        Promise<UsersReturnData> {
        try {
            if (search) {
                /** Search Users by firstname, lastname, email or phone */
                const usersFromDb = await db.User.findAll({
                    where: {
                        [Op.or]: [
                            {
                                phone: {
                                    [Op.substring]: search
                                }
                            },
                            {
                                firstname: {
                                    [Op.substring]: search
                                }
                            },
                            {
                                lastname: {
                                    [Op.substring]: search
                                }
                            },
                            {
                                email: {
                                    [Op.substring]: search
                                }
                            },
                        ]
                    },
                    include: 'Admin'
                });
                if (!usersFromDb)
                    return ({ message: 'No users found', success: false });
                else {
                    const data = this.prepareData(usersFromDb);
                    return ({message: 'These users seem like a good fit', success: true, data: data});
                }
                /** End of searching Users by firstname, lastname, email or phone */
            } else {
                /** Getting all Users */
                const usersFromDb = await db.User.findAll({include: 'Admin'});
                if (!usersFromDb)
                    return ({ message: 'No users found', success: false });
                else {
                    const data = this.prepareData(usersFromDb);
                    return ({message: 'Here are all the users boss', success: true, data: data});
                }
                /** End of getting all Users */
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
                const userFromDb = await db.User.findOne({where: {id: user_id}, include: 'Admin'});
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

    public async updateUser(user_id: number, phone?: string, firstname?: string, lastname?: string, email?: string): Promise<UsersReturnData> {
        if (!user_id)
            return ({ message: 'User id was not provided', success: false })
        else {
            try {
                const userFromDb = await db.User.findOne({where: {id: user_id}, include: 'Admin'});
                if (!userFromDb)
                    return ({ message: 'user was not found', success: false });
                else {
                    userFromDb.update({
                        'phone': phone ?? userFromDb.phone,
                        'firstname': firstname ?? userFromDb.firstname,
                        'lastname': lastname ?? userFromDb.lastname,
                        'email': email ?? userFromDb.email
                    });
                }
            } catch (e) {
                console.log(e);
                return ({ message: 'An error occurred', success: false });
            }
        }
    }

    private prepareData(users: IUser[]): ISafeUser [] {
        if (users.length == 1) {
            const unsafe_user = users.pop();
            let isAdmin = false;
            if (unsafe_user.Admin)
                isAdmin = true;
            const data: ISafeUser [] = [
                {
                    id: unsafe_user.id,
                    phone: unsafe_user.phone,
                    email: unsafe_user.email,
                    firstname: unsafe_user.firstname,
                    lastname: unsafe_user.lastname,
                    isAdmin: isAdmin
                }
            ];
            return data;
        } else {
            const data: ISafeUser[] = users.map(unsafe_data => {
                    let isAdmin = false;
                    if (unsafe_data.Admin)
                        isAdmin = true;
                    return {
                        id: unsafe_data.id,
                        phone: unsafe_data.phone,
                        email: unsafe_data.email,
                        firstname: unsafe_data.firstname,
                        lastname: unsafe_data.lastname,
                        isAdmin: isAdmin
                    };
                });
            return data;
        }
    }
}