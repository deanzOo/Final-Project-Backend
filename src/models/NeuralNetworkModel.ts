import { BuildOptions, Sequelize, Model, DataTypes } from "sequelize";

export interface INeuralNetwork extends Model {
    readonly id: number;
    readonly name: string,
    readonly hyper_params_id: number,
    readonly dataset_id: number,
}

export type NeuralNetworkModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): INeuralNetwork
}
export function getNeuralNetwork(sequelize: Sequelize): NeuralNetworkModelStatic {
    return <NeuralNetworkModelStatic>sequelize.define('neuralnetwork', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        hyper_params_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dataset_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        underscored: true
    });
}