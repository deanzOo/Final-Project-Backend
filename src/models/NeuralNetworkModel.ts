import { BuildOptions, Sequelize, Model, DataTypes } from "sequelize";

export interface INeuralNetwork extends Model {
    readonly id: number;
    readonly name: string,
    readonly hyper_params_id: string,
    readonly dataset_id: string,
    readonly create_at: string,
}

export type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): INeuralNetwork
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
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: false,
        underscored: true
    });
}