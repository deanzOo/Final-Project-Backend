import * as express from 'express';
import { clientGuardian } from "../../library/validations";
// @ts-ignore
import { errors, http_codes} from '../../config/errors';
import {ContainerBuilder} from "node-dependency-injection";

function Gans (DIContainer: ContainerBuilder) {
    const router: express.Router = express.Router();

    router.use(clientGuardian(DIContainer));

    router.get('/', (req: express.Request, res: express.Response) => {
        res.status(200).json();
    });

    return router;
}

export default Gans;