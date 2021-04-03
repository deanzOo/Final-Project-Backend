import Controller, {Methods} from "../../types/Controller";
import {NextFunction, Request, Response} from "express";
import NeuralNetworksService from "../../services/NeuralNetworksService";
import * as express from "express";

export default class NeuralNetworksController extends Controller {
    path = '/';
    routes = [
        {
            path: '/',
            method: Methods.GET,
            handler: this.getNeuralNetworks,
            localMiddleware: []
        },
        {
            path: `/`,
            method: Methods.POST,
            handler: this.createNeuralNetwork,
            localMiddleware: []
        },
        {
            path: '/',
            method: Methods.DELETE,
            handler: this.deleteNeuralNetwork,
            localMiddleware: []
        }
    ];
    subroutes = [];

    constructor(highLevelMiddleware?: Array<(req: express.Request, res: express.Response, next: express.NextFunction) => void>) {
        super(highLevelMiddleware);
    }

    async getNeuralNetworks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.query?.id;
            const neuralNetworksService = new NeuralNetworksService();

            if (id && typeof id === "string") {
                const neuralNetowrksData = await neuralNetworksService.getNeuralNetworks(parseInt(id));
                if (neuralNetowrksData.success)
                    super.sendSuccess(res, neuralNetowrksData.data!, neuralNetowrksData.message);
                else
                    super.sendError(res, neuralNetowrksData.message);
            } else {
                const neuralNetowrksData = await neuralNetworksService.getNeuralNetworks();
                if (neuralNetowrksData.success) {
                    super.sendSuccess(res, neuralNetowrksData.data!, neuralNetowrksData.message);
                } else {
                    super.sendError(res, neuralNetowrksData.message);
                }
            }
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async createNeuralNetwork(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                name,
                hyperparameter_id,
                dataset_id
            } = req.body;
            const neuralNetworksService = new NeuralNetworksService();
            const data = await neuralNetworksService.createNeuralNetwork(
                name,
                hyperparameter_id,
                dataset_id);
            if (data.success) {
                super.sendSuccess(res, data.data!, data.message);
            } else
                super.sendError(res, data.message);
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

    async deleteNeuralNetwork(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.body;
            const neuralNetworksService = new NeuralNetworksService();
            const data = await neuralNetworksService.deleteNeuralNetwork(id);
            if (data.success)
                super.sendSuccess(res, data.data!, data.message);
            else
                super.sendError(res, data.message);
        } catch (e) {
            console.log(e);
            super.sendError(res)
        }
    }

}