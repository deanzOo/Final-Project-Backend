import db from '../models/index';
import { ISafeLogo } from "../types";
import { ILogo } from "../models/LogoModel";
import {ValidationError} from "sequelize";

interface LogoReturnData {
    message: string;
    success: boolean;
    data?: ISafeLogo [];
    statusCode?: number;
}

export default class LogoService {
    constructor(
    ) {
    }

    public async getLogos(id?: number):
        Promise<LogoReturnData> {
        try {
            if (id) {
                const logoFromDb = await db.Logo.findOne({where: {id: id}});
                if (!logoFromDb)
                    return ({ message: 'Logo was not found', success: false });
                else {
                    const data = this.prepareData([logoFromDb]);
                    return ({message: 'Logo found', success: true, data: data});
                }
            } else {
                const logoFromDb = await db.Logo.findAll();
                if (!logoFromDb)
                    return ({ message: 'No logos found', success: false });
                else {
                    const data = this.prepareData(logoFromDb);
                    return ({message: 'Here are all the known logos boss', success: true, data: data});
                }
            }
        } catch(e) {
            console.log(e);
            return ({ message: 'An error occurred', success: false });
        }
    }

    public async deleteLogo(id: number): Promise<LogoReturnData> {
        if (!id)
            return ({ message: 'id was not provided', success: false })
        else {
            try {
                const logoFromDb = await db.Logo.findOne({where: {id: id}});
                if (!logoFromDb)
                    return ({ message: 'Logo was not found', success: false });
                else {
                    await logoFromDb.destroy();
                    return ({message: 'Logo deleted', success: true, data: []});
                }
            } catch (e) {
                console.log(e);
                return ({ message: 'An error occurred', success: false });
            }
        }
    }

    public async createLogo(
    width,
    height,
    channels,
    format,
    model_id,
    user_id,
    url
    ): Promise<LogoReturnData> {
        try {
            const createdLogo = await db.Logo.create({
                width: width,
                height: height,
                channels: channels,
                format: format,
                model_id: model_id,
                user_id: user_id,
                url: url
            });
            await createdLogo.validate();
            const data = this.prepareData([createdLogo]);
            return({ message: 'Successfully created logo', success: true, data: data });
        } catch(e) {
            console.log(e);
            if (e instanceof ValidationError)
                return ({ message: e.message, success: false });
            else
                return ({ message: 'An error occurred', success: false });
        }
    }

    private prepareData(logos: ILogo[]): ISafeLogo [] {
        if (logos.length == 1) {
            const unsafe_logo = logos.pop();
            const data: ISafeLogo [] = [
                {
                    id: unsafe_logo.id,
                    width: unsafe_logo.width,
                    height: unsafe_logo.height,
                    channels: unsafe_logo.channels,
                    format: unsafe_logo.format,
                    url: unsafe_logo.url
                }
            ];
            return data;
        } else {
            const data: ISafeLogo[] = logos.map(unsafe_data => {
                return {
                    id: unsafe_data.id,
                    width: unsafe_data.width,
                    height: unsafe_data.height,
                    channels: unsafe_data.channels,
                    format: unsafe_data.format,
                    url: unsafe_data.url
                };
            });
            return data;
        }
    }
}