import { BuildOptions, Sequelize, Model, DataTypes } from "sequelize";

export interface IHyperparameters extends Model {
    readonly id: number;
    readonly batch_size: number,
    readonly learning_rate: number,
    readonly img_h: number,
    readonly img_w: number,
    readonly channels: number,
    readonly use_bias: boolean,
    readonly dropout_rate: number,
    readonly epochs: number,
    readonly conv_padding: number,
    readonly latent_dim: number,
}

export type HyperparametersModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IHyperparameters
}
export function getHyperparameters(sequelize: Sequelize): HyperparametersModelStatic {
    return <HyperparametersModelStatic>sequelize.define('hyperparameters', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        batch_size: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        learning_rate: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        img_h: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            },
            defaultValue: 32
        },
        img_w: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            },
            defaultValue: 32
        },
        channels: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 3
            },
            defaultValue: 3
        },
        use_bias: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        droupout_rate: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            },
            defaultValue: 0.5
        },
        epochs: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            },
            defaultValue: 50
        },
        conv_padding: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            },
            defaultValue: 0.5
        },
        latent_dim: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            },
            defaultValue: 100
        }
    }, {
        timestamps: false,
        underscored: true
    });
}