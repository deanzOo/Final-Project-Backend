import * as express from 'express';
// @ts-ignore
import { errors, http_codes} from '../config/errors';
import {ContainerBuilder} from "node-dependency-injection";

import Admins from "./handlers/Admins";
import Auth from "./handlers/Auth";
import Classes from "./handlers/Classes";
import ClassifiedImages from "./handlers/ClassifiedImages";
import Datasets from "./handlers/Datasets";
import Gans from "./handlers/Gans";
import History from "./handlers/History";
import Hyperparameters from "./handlers/Hyperparameters";
import Images from "./handlers/Images";
import Logos from "./handlers/Logos";
import Metrics from "./handlers/Metrics";
import ModelGroup from "./handlers/ModelGroup";
import NeuralNetworks from "./handlers/NeuralNetworks";
import Samples from "./handlers/Samples";
import Users from "./handlers/Users";

function Api (DIContainer: ContainerBuilder) {
    const router: express.Router = express.Router();

    router.use('/Admins', Admins(DIContainer));
    router.use('/Auth', Auth(DIContainer));
    router.use('/Classes', Classes(DIContainer));
    router.use('/ClassifiedImages', ClassifiedImages(DIContainer));
    router.use('/Datasets', Datasets(DIContainer));
    router.use('/Gans', Gans(DIContainer));
    router.use('/History', History(DIContainer));
    router.use('/Hyperparameters', Hyperparameters(DIContainer));
    router.use('/Images', Images(DIContainer));
    router.use('/Logos', Logos(DIContainer));
    router.use('/Metrics', Metrics(DIContainer));
    router.use('/ModelGroup', ModelGroup(DIContainer));
    router.use('/NeuralNetworks', NeuralNetworks(DIContainer));
    router.use('/Samples', Samples(DIContainer));
    router.use('/Users', Users(DIContainer));

    router.get('/', (req, res) => {
        res.status(200).json({'message': 'test route'});
    })

    return router;
}

export default Api;