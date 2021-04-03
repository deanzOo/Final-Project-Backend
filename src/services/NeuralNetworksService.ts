import db from '../models/index';
import { ISafeNeuralNetwork } from "../types";
import {ForeignKeyConstraintError, ValidationError} from "sequelize";
import {INeuralNetwork} from "../models/NeuralNetworkModel";

interface NeuralNetworkReturnData {
    message: string;
    success: boolean;
    data?: ISafeNeuralNetwork [];
    statusCode?: number;
}

export default class NeuralNetworksService {
    constructor(
    ) {
    }

    public async getNeuralNetworks(id?: number):
        Promise<NeuralNetworkReturnData> {
        try {
            if (id) {
                const neuralNetworkFromDb = await db.NeuralNetwork.findOne({where: {id: id}});
                if (!neuralNetworkFromDb)
                    return ({ message: 'Neural Network was not found', success: false });
                else {
                    const data = this.prepareData([neuralNetworkFromDb]);
                    return ({message: 'Neural Network found', success: true, data: data});
                }
            } else {
                const neuralNetworkFromDb = await db.NeuralNetwork.findAll();
                if (!neuralNetworkFromDb)
                    return ({ message: 'No Neural Networks found', success: false });
                else {
                    const data = this.prepareData(neuralNetworkFromDb);
                    return ({message: 'Here are all the known Neural Networks boss', success: true, data: data});
                }
            }
        } catch(e) {
            console.log(e);
            return ({ message: 'An error occurred', success: false });
        }
    }

    public async deleteNeuralNetwork(id: number): Promise<NeuralNetworkReturnData> {
        if (!id)
            return ({ message: 'id was not provided', success: false })
        else {
            try {
                const neuralNetworkFromDb = await db.NeuralNetwork.findOne({where: {id: id}});
                if (!neuralNetworkFromDb)
                    return ({ message: 'Neural Network was not found', success: false });
                else {
                    await neuralNetworkFromDb.destroy();
                    return ({message: 'Neural Network deleted', success: true, data: []});
                }
            } catch (e) {
                console.log(e);
                return ({ message: 'An error occurred', success: false });
            }
        }
    }


    public async createNeuralNetwork(
        name: string,
        hyperparameter_id: string,
        dataset_id: number
    ): Promise<NeuralNetworkReturnData> {
        try {
            const createdDataset = await db.NeuralNetwork.create({
                name: name,
                hyperparameter_id: hyperparameter_id,
                dataset_id: dataset_id
            });
            await createdDataset.validate();
            const data = this.prepareData([createdDataset]);
            return({ message: 'Successfully created dataset', success: true, data: data });
        } catch(e) {
            console.log(e);
            if (e instanceof ValidationError || e instanceof ForeignKeyConstraintError)
                return ({ message: e.message, success: false });
            else
                return ({ message: 'An error occurred', success: false });
        }
    }

    private prepareData(neuralNetworks: INeuralNetwork[]): ISafeNeuralNetwork [] {
        if (neuralNetworks.length == 1) {
            const unsafe_neural_network = neuralNetworks.pop();
            const data: ISafeNeuralNetwork [] = [
                {
                    id: unsafe_neural_network.id,
                    name: unsafe_neural_network.name,
                    hyperparameter_id: unsafe_neural_network.hyperparameter_id,
                    dataset_id: unsafe_neural_network.dataset_id
                }
            ];
            return data;
        } else {
            const data: ISafeNeuralNetwork[] = neuralNetworks.map(unsafe_data => {
                return {
                    id: unsafe_data.id,
                    name: unsafe_data.name,
                    hyperparameter_id: unsafe_data.hyperparameter_id,
                    dataset_id: unsafe_data.dataset_id
                };
            });
            return data;
        }
    }
}