import db from '../models/index';
import {ISafeHyperparameters} from "../types";
import { IHyperparameters } from "../models/HyperparametersModel";

interface HyperparametersReturnData {
    message: string;
    success: boolean;
    data?: ISafeHyperparameters [];
    statusCode?: number;
}

export default class HyperparametersService {
    constructor(
    ) {
    }

    public async getHyperparameters(id?: number):
        Promise<HyperparametersReturnData> {
        try {
            if (id) {
                const hyperParamsFromDb = await db.Hyperparameters.findOne({where: {id: id}});
                if (!hyperParamsFromDb)
                    return ({ message: 'Hyperparameters was not found', success: false });
                else {
                    const data = this.prepareData([hyperParamsFromDb]);
                    return ({message: 'Hyperparameters found', success: true, data: data});
                }
            } else {
                const hyperParamsFromDb = await db.Hyperparameters.findAll();
                if (!hyperParamsFromDb)
                    return ({ message: 'No hyperparameters found', success: false });
                else {
                    const data = this.prepareData(hyperParamsFromDb);
                    return ({message: 'Here are all the hyperparameters sheets boss', success: true, data: data});
                }
            }
        } catch(e) {
            console.log(e);
            return ({ message: 'An error occurred', success: false });
        }
    }

    public async deleteHyperParams(id: number): Promise<HyperparametersReturnData> {
        if (!id)
            return ({ message: 'id was not provided', success: false })
        else {
            try {
                const hyperParamsFromDb = await db.Hyperparameters.findOne({where: {id: id}});
                if (!hyperParamsFromDb)
                    return ({ message: 'Hyperparameters was not found', success: false });
                else {
                    await hyperParamsFromDb.destroy();
                    return ({message: 'Hyperparameters deleted', success: true, data: []});
                }
            } catch (e) {
                console.log(e);
                return ({ message: 'An error occurred', success: false });
            }
        }
    }


    public async createHyperParams(
        batch_size: number,
        learning_rate: number,
        img_h: number,
        img_w: number,
        channels: number,
        use_bias: number,
        dropout_rate: number,
        epochs: number,
        conv_padding: number,
        latent_dim:number
    ): Promise<HyperparametersReturnData> {
        try {
            const createdHyperparameters = await db.Hyperparameters.create({
                batch_size: batch_size,
                learning_rate: learning_rate,
                img_h: img_h,
                img_w: img_w,
                channels: channels,
                use_bias: use_bias,
                dropout_rate: dropout_rate,
                epochs: epochs,
                conv_padding: conv_padding,
                latent_dim:latent_dim
            });
            await createdHyperparameters.validate();
            const data = this.prepareData([createdHyperparameters]);
            return({ message: 'Successfully created hyperparameters', success: true, data: data });
        } catch(e) {
            console.log(e);
            return ({ message: 'An error occurred', success: false });
        }
    }

    private prepareData(hyperparams: IHyperparameters[]): ISafeHyperparameters [] {
        if (hyperparams.length == 1) {
            const unsafe_hyperparams = hyperparams.pop();
            const data: ISafeHyperparameters [] = [
                {
                    id: unsafe_hyperparams.id,
                    batch_size: unsafe_hyperparams.batch_size,
                    learning_rate: unsafe_hyperparams.learning_rate,
                    img_h: unsafe_hyperparams.img_h,
                    img_w: unsafe_hyperparams.img_w,
                    channels: unsafe_hyperparams.channels,
                    use_bias: unsafe_hyperparams.use_bias,
                    dropout_rate: unsafe_hyperparams.dropout_rate,
                    epochs: unsafe_hyperparams.epochs,
                    conv_padding: unsafe_hyperparams.conv_padding,
                    latent_dim:unsafe_hyperparams.latent_dim
                }
            ];
            return data;
        } else {
            const data: ISafeHyperparameters[] = hyperparams.map(unsafe_data => {
                return {
                    id: unsafe_data.id,
                    batch_size: unsafe_data.batch_size,
                    learning_rate: unsafe_data.learning_rate,
                    img_h: unsafe_data.img_h,
                    img_w: unsafe_data.img_w,
                    channels: unsafe_data.channels,
                    use_bias: unsafe_data.use_bias,
                    dropout_rate: unsafe_data.dropout_rate,
                    epochs: unsafe_data.epochs,
                    conv_padding: unsafe_data.conv_padding,
                    latent_dim:unsafe_data.latent_dim
                };
            });
            return data;
        }
    }
}