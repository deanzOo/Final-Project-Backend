import * as express from 'express';
import { clientGuardian } from "../../../library/validations";
// @ts-ignore
import { errors, http_codes} from '../../../config/errors';
import {ContainerBuilder} from "node-dependency-injection";
import { User, UserModel } from "../../../models/user.model";

function UsersController (DIContainer: ContainerBuilder) {
    const router: express.Router = express.Router();

    // router.use(clientGuardian(DIContainer));

    router.get('/', (req: express.Request, res: express.Response) => {
        const um = UserModel.getInstance(DIContainer);
        um.getUsers({res: res});
    });

    return router;
}

export default UsersController;