import db from '../models/index';
import { ISafeDataset } from "../types";
import { IDataset } from "../models/DatasetModel";
import {Sequelize, ValidationError} from "sequelize";

interface DatasetReturnData {
    message: string;
    success: boolean;
    data?: ISafeDataset [];
    statusCode?: number;
}

export default class DatasetService {
    constructor(
    ) {
    }

    public async getDatasets(id?: number):
        Promise<DatasetReturnData> {
        try {
            if (id) {
                const datasetFromDb = await db.Dataset.findOne({where: {id: id}});
                if (!datasetFromDb)
                    return ({ message: 'Dataset was not found', success: false });
                else {
                    const data = this.prepareData([datasetFromDb]);
                    return ({message: 'Dataset found', success: true, data: data});
                }
            } else {
                const datasetFromDb = await db.Dataset.findAll();
                if (!datasetFromDb)
                    return ({ message: 'No datasets found', success: false });
                else {
                    const data = this.prepareData(datasetFromDb);
                    return ({message: 'Here are all the known datasets boss', success: true, data: data});
                }
            }
        } catch(e) {
            console.log(e);
            return ({ message: 'An error occurred', success: false });
        }
    }

    public async deleteDataset(id: number): Promise<DatasetReturnData> {
        if (!id)
            return ({ message: 'id was not provided', success: false })
        else {
            try {
                const datasetFromDb = await db.Dataset.findOne({where: {id: id}});
                if (!datasetFromDb)
                    return ({ message: 'Dataset was not found', success: false });
                else {
                    await datasetFromDb.destroy();
                    return ({message: 'Dataset deleted', success: true, data: []});
                }
            } catch (e) {
                console.log(e);
                return ({ message: 'An error occurred', success: false });
            }
        }
    }


    public async createDataset( image_format: string,
                                location: string,
                                size: number,
                                name: string,
                                ): Promise<DatasetReturnData> {
        try {
            const createdDataset = await db.Dataset.create({
                image_format: image_format,
                location: location,
                size: size,
                name: name
            });
            await createdDataset.validate();
            const data = this.prepareData([createdDataset]);
            return({ message: 'Successfully created dataset', success: true, data: data });
        } catch(e) {
            console.log(e);
            if (e instanceof ValidationError)
                return ({ message: e.message, success: false });
            else
                return ({ message: 'An error occurred', success: false });
        }
    }

    private prepareData(datasets: IDataset[]): ISafeDataset [] {
        if (datasets.length == 1) {
            const unsafe_dataset = datasets.pop();
            const data: ISafeDataset [] = [
                {
                    id: unsafe_dataset.id,
                    image_format: unsafe_dataset.image_format,
                    location: unsafe_dataset.location,
                    size: unsafe_dataset.size,
                    name: unsafe_dataset.name
                }
            ];
            return data;
        } else {
            const data: ISafeDataset[] = datasets.map(unsafe_data => {
                return {
                    id: unsafe_data.id,
                    image_format: unsafe_data.image_format,
                    location: unsafe_data.location,
                    size: unsafe_data.size,
                    name: unsafe_data.name
                };
            });
            return data;
        }
    }
}