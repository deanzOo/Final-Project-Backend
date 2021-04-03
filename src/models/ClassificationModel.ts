import { BuildOptions, Sequelize, Model, DataTypes } from "sequelize";

export interface IClassification extends Model {
    readonly id: number;
    readonly name: string,
}

export type ClassificationModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IClassification
}
export function getClassification(sequelize: Sequelize): ClassificationModelStatic {
    return <ClassificationModelStatic>sequelize.define('classification', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: false,
        underscored: true
    });
}