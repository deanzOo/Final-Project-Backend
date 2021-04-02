import db from '../models/index';
import {ISafeUsersData, ISafeUser} from "../types";
import {IAdmin} from "../models/AdminModel";

interface AdminReturnData {
    message: string;
    success: boolean;
    data?: ISafeUser [];
    statusCode?: number;
}

export default class AdminService {
    constructor(
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

    public async makeAdmin(user_id: number): Promise<AdminReturnData> {
        try {
            const user = await db.User.findOne({where: {id: user_id}});
            if (!user) {
                return ({message: 'no user with this id', success: false});
            } else {
                // @ts-ignore
                let admin = await user.createAdmin({user_id: user.id, permissions: 0});
                admin.user = user;
                const data = this.prepareData([admin]);
                return ({message: 'Success', success: true, data: data});
            }
        } catch (e) {
            console.log(e);
            return ({message: 'Failed', success: false});
        }
    }

    public async deleteAdmin(admin_id: number): Promise<AdminReturnData> {
        if (!admin_id)
            return ({ message: 'Admin id was not provided', success: false })
        else {
            try {
                const adminFromDb = await db.Admin.findOne({where: {user_id: admin_id}});
                if (!adminFromDb)
                    return ({ message: 'Admin was not found', success: false });
                else {
                    await adminFromDb.destroy();
                    return ({message: 'Admin deleted', success: true, data: []});
                }
            } catch (e) {
                console.log(e);
                return ({ message: 'An error occurred', success: false });
            }
        }
    }

    private prepareData(admins: IAdmin[]): ISafeUser [] {
        let safeAdmins: ISafeUser[] = [];
        admins.forEach(admin => {
            // @ts-ignore
            safeAdmins.push({
                id: admin.user_id,
                phone: admin?.user?.phone,
                email: admin?.user?.email,
                firstname: admin?.user?.firstname,
                lastname: admin?.user?.lastname,
                isAdmin: true
            });
        });

        return safeAdmins;
    }
}