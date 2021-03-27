import { BuildOptions, Sequelize, Model, DataTypes } from "sequelize";
import {IAdmin} from "./AdminModel";

export interface IUser extends Model {
    readonly id: number;
    readonly phone: string,
    readonly password: string,
    readonly email?: string,
    readonly firstname?: string,
    readonly lastname?: string
    readonly admin?: IAdmin
    readonly created_at: Date;
    readonly updated_at: Date;
}

export type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUser
}
export function getUser(sequelize: Sequelize): UserModelStatic {
    return <UserModelStatic>sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        phone: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                is: /^05[0-9]{8}$/i
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        underscored: true
    });
}