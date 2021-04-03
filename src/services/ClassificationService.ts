import db from '../models/index';
import { ISafeClassification } from "../types";
import {ForeignKeyConstraintError, ValidationError} from "sequelize";
import { IClassification } from "../models/ClassificationModel";

interface ClassificationReturnData {
    message: string;
    success: boolean;
    data?: ISafeClassification [];
    statusCode?: number;
}

export default class ClassificationService {
    constructor(
    ) {
    }

    public async getClassifications(id?: number):
        Promise<ClassificationReturnData> {
        try {
            if (id) {
                const classificationFromDb = await db.Classification.findOne({where: {id: id}});
                if (!classificationFromDb)
                    return ({ message: 'Classification was not found', success: false });
                else {
                    const data = this.prepareData([classificationFromDb]);
                    return ({message: 'Classification found', success: true, data: data});
                }
            } else {
                const classificationFromDb = await db.Classification.findAll();
                if (!classificationFromDb)
                    return ({ message: 'No Classifications found', success: false });
                else {
                    const data = this.prepareData(classificationFromDb);
                    return ({message: 'Here are all the known Classifications boss', success: true, data: data});
                }
            }
        } catch(e) {
            console.log(e);
            return ({ message: 'An error occurred', success: false });
        }
    }

    public async deleteClassification(id: number): Promise<ClassificationReturnData> {
        if (!id)
            return ({ message: 'id was not provided', success: false })
        else {
            try {
                const classificationFromDb = await db.Classification.findOne({where: {id: id}});
                if (!classificationFromDb)
                    return ({ message: 'Classification was not found', success: false });
                else {
                    await classificationFromDb.destroy();
                    return ({message: 'Classification deleted', success: true, data: []});
                }
            } catch (e) {
                console.log(e);
                return ({ message: 'An error occurred', success: false });
            }
        }
    }


    public async createClassification(
        name: string,
    ): Promise<ClassificationReturnData> {
        try {
            const createdDataset = await db.NeuralNetwork.create({
                name: name,
            });
            await createdDataset.validate();
            const data = this.prepareData([createdDataset]);
            return({ message: 'Successfully created Classification', success: true, data: data });
        } catch(e) {
            console.log(e);
            if (e instanceof ValidationError || e instanceof ForeignKeyConstraintError)
                return ({ message: e.message, success: false });
            else
                return ({ message: 'An error occurred', success: false });
        }
    }

    private prepareData(classifications: IClassification[]): ISafeClassification [] {
        if (classifications.length == 1) {
            const unsafe_classification = classifications.pop();
            const data: ISafeClassification [] = [
                {
                    id: unsafe_classification.id,
                    name: unsafe_classification.name,
                }
            ];
            return data;
        } else {
            const data: ISafeClassification[] = classifications.map(unsafe_data => {
                return {
                    id: unsafe_data.id,
                    name: unsafe_data.name,
                };
            });
            return data;
        }
    }
}