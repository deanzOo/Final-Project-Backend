import {Sequelize} from "sequelize";
import Config from '../config/config';
import {getUser, IUser, UserModelStatic} from "./UserModel";

interface IDatabase {
    sequelize: Sequelize;
    User: UserModelStatic;
}

const sequelize = new Sequelize(
    Config.db.database, Config.db.user, Config.db.password, {
        host: Config.db.host,
        dialect: "mysql",
        pool: {
            max: 9,
            min: 0,
            idle: 10000
        }
    }
);

const User = getUser(sequelize);

const db: IDatabase = {
    sequelize,
    User,
};

db.sequelize.sync()
    .then(() => console.log('Database & tables synced'))
    .catch(e => console.log(e));

export default db;
export type UserModel = IUser;
