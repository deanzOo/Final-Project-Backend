import * as express from 'express';
// @ts-ignore
import { errors, http_codes} from '../config/errors';
import {ContainerBuilder} from "node-dependency-injection";

import Admins from "./handlers/admin/Admins";
import Auth from "./handlers/admin/Auth";
import Classes from "./handlers/admin/Classes";
import ClassifiedImages from "./handlers/admin/ClassifiedImages";
import Datasets from "./handlers/admin/Datasets";
import Gans from "./handlers/admin/Gans";
import History from "./handlers/admin/History";
import Hyperparameters from "./handlers/admin/Hyperparameters";
import Images from "./handlers/admin/Images";
import Logos from "./handlers/admin/Logos";
import Metrics from "./handlers/admin/Metrics";
import ModelGroup from "./handlers/admin/ModelGroup";
import NeuralNetworks from "./handlers/admin/NeuralNetworks";
import Samples from "./handlers/admin/Samples";
import UsersController from "./handlers/admin/users.controller";

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
    router.use('/Users', UsersController(DIContainer));

    router.get('/', (req, res) => {
        res.status(200).json({'message': 'test route'});
    })

    return router;
}

export default Api;