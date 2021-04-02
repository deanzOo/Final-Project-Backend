import { BuildOptions, Sequelize, Model, DataTypes } from "sequelize";

export interface IDataset extends Model {
    readonly id: number;
    readonly image_format: string,
    readonly location: string,
    readonly size: number,
    readonly name: string,
}

export type DatasetModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IDataset
}
export function getDataset(sequelize: Sequelize): DatasetModelStatic {
    return <DatasetModelStatic>sequelize.define('dataset', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        image_format: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        name: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: false,
        underscored: true
    });
}