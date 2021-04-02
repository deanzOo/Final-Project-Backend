import {Sequelize} from "sequelize";
import Config from '../config/config';
import {getUser, IUser, UserModelStatic} from "./UserModel";
import {getAdmin, IAdmin, AdminModelStatic} from "./AdminModel";
import {getHyperparameters, IHyperparameters, HyperparametersModelStatic} from "./HyperparametersModel";
import {getDataset, IDataset, DatasetModelStatic} from "./DatasetModel";
import {getNeuralNetwork, INeuralNetwork, NeuralNetworkModelStatic} from "./NeuralNetworkModel";

interface IDatabase {
    sequelize: Sequelize;
    User: UserModelStatic;
    Admin: AdminModelStatic;
    Hyperparameters: HyperparametersModelStatic;
    Dataset: DatasetModelStatic;
    NeuralNetwork: NeuralNetworkModelStatic;
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
const Admin = getAdmin(sequelize);
const Hyperparameters = getHyperparameters(sequelize);
const Dataset = getDataset(sequelize);
const NeuralNetwork = getNeuralNetwork(sequelize);

User.hasOne(Admin, {
    onDelete: 'CASCADE',
    as: 'Admin',
    foreignKey: 'user_id'
});
Admin.belongsTo(User, {
    onDelete: 'NO ACTION'
});
NeuralNetwork.hasOne(Dataset, {
    onDelete: 'NO ACTION',
    as: 'Dataset',
    foreignKey: 'dataset_id'
});
Dataset.hasMany(NeuralNetwork, {
    onDelete: 'NO ACTION'
});
NeuralNetwork.hasOne(Hyperparameters, {
    onDelete: 'CASCADE',
    as: 'Hyperparams',
    foreignKey: 'hyper_params_id'
});
Hyperparameters.belongsTo(NeuralNetwork, {
    onDelete: 'NO ACTION'
});

const db: IDatabase = {
    sequelize,
    User,
    Admin,
    Hyperparameters,
    Dataset,
    NeuralNetwork
};

db.sequelize.sync()
    .then(() => console.log('Database & tables synced'))
    .catch(e => console.log(e));

export default db;
export type UserModel = IUser;
export type AdminModel = IAdmin;
export type HyperparametersModel = IHyperparameters;
export type DatasetModel = IDataset;
export type NeuralNetworkModel = INeuralNetwork;