import db from '../models/index';
import {ISafeUsersData, ISafeUser} from "../types";
import {IAdmin} from "../models/AdminModel";

interface AdminReturnData {
    message: string;
    success: boolean;
    data?: ISafeUsersData;
    statusCode?: number;
}

export default class AdminService {
    constructor(
        public readonly user_id?: number,
        public readonly user?: ISafeUser
    ) {
    }

    public async getAdmins(): Promise<AdminReturnData> {
        try {
            let admins = await db.Admin.findAll({include: 'user'});
            if (admins) {
                const data = this.prepareData(admins);
                return ({ message: 'Success', success: true, data: data });
            } else {
                return ({message: 'No admins found', success: false, statusCode: 400});
            }
        } catch (e) {
            console.log(e);
            return ({message: 'Some error occurd', success: false, statusCode: 500});
        }
    }

    private prepareData(admins: IAdmin[]): ISafeUsersData {
        let safeAdmins: ISafeUser[] = [];
        admins.forEach(admin => {
            safeAdmins.push({
                id: admin.user_id,
                phone: admin.user.phone,
                email: admin.user.email,
                firstname: admin.user.firstname,
                lastname: admin.user.lastname,
                isAdmin: true
            });
        });
        let data: ISafeUsersData;
        if (safeAdmins.length > 1)
            data = {admins: safeAdmins};
        else
            data = {admin: safeAdmins.pop()}

        return data;
    }
}