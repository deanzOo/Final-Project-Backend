import db from '../models/index';
import { ISafeUsersData, ISafeUser } from "../types";
import { Op } from "sequelize";

interface AuthReturnData {
    message: string;
    success: boolean;
    data?: object;
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

    public async getUsers(): Promise<AuthReturnData> {
        try {
            let op_or = [];
            if (this.id)
                op_or.push({id: this.id});
            if (this.phone)
                op_or.push({phone: this.phone});
            if (this.firstname)
                op_or.push({firstname: this.firstname});
            if (this.lastname)
                op_or.push({lastname: this.lastname});
            if (this.email)
                op_or.push({email: this.email});
            let where_clause = {};
            if (op_or.length > 0) {
                where_clause = {[Op.or]: op_or};
            }
            const usersFromDb = await db.User.findAll({
                where: where_clause
            });
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

    private prepareData(users: ISafeUser[]): ISafeUsersData {
        if (users.length == 1) {
            const unsafe_user = users.pop();
            const data: ISafeUsersData = {
                user: {
                    id: unsafe_user.id,
                    phone: unsafe_user.phone,
                    email: unsafe_user.email,
                    firstname: unsafe_user.firstname,
                    lastname: unsafe_user.lastname,
                }
            }
            return data;
        } else {
            const data: ISafeUsersData = {
                users: users.map(unsafe_data => {
                    return {
                        id: unsafe_data.id,
                        phone: unsafe_data.phone,
                        email: unsafe_data.email,
                        firstname: unsafe_data.firstname,
                        lastname: unsafe_data.lastname,
                    };
                })
            }
            return data;
        }
    }
}