import { BuildOptions, Sequelize, Model, DataTypes } from "sequelize";
import {IUser} from "./UserModel";

export interface IAdmin extends Model {
    readonly user_id: number;
    readonly permissions: number,
    readonly user?: IUser
}

export type AdminModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IAdmin
}
export function getAdmin(sequelize: Sequelize): AdminModelStatic {
    return <AdminModelStatic>sequelize.define('admin', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        permissions: {
            type: DataTypes.JSON,
            allowNull: false
        },
    }, {
        underscored: true
    });
}