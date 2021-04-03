import { BuildOptions, Sequelize, Model, DataTypes } from "sequelize";

export interface ILogo extends Model {
    readonly id: number;
    readonly width: number,
    readonly height: number,
    readonly channels: number,
    readonly format: string,
    readonly model_id: number,
    readonly user_id: number,
    readonly url: string
}

export type LogoModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ILogo
}
export function getLogo(sequelize: Sequelize): LogoModelStatic {
    return <LogoModelStatic>sequelize.define('logo', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        channels: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 3
            }
        },
        format: {
            type: DataTypes.STRING,
        },
        model_id: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        url: {
            type: DataTypes.STRING
        },
    }, {
        timestamps: false,
        underscored: true
    });
}