import * as express from 'express';
import { clientGuardian } from "../../library/validations";
// @ts-ignore
import { errors, http_codes} from '../config/errors';
import {ContainerBuilder} from "node-dependency-injection";



function Images (DIContainer: ContainerBuilder) {
    const router: express.Router = express.Router();

    router.use(clientGuardian(DIContainer));

    router.post('/', (req: express.Request, res: express.Response) => {
        res.status(200).send();
    });

    return router;
}

export default Images;