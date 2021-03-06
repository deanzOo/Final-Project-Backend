import {Sequelize} from "sequelize";
import Config from '../config/config';
import {getUser, IUser, UserModelStatic} from "./UserModel";
import {getAdmin, IAdmin, AdminModelStatic} from "./AdminModel";
import {getHyperparameters, IHyperparameters, HyperparametersModelStatic} from "./HyperparametersModel";
import {getDataset, IDataset, DatasetModelStatic} from "./DatasetModel";
import {getNeuralNetwork, INeuralNetwork, NeuralNetworkModelStatic} from "./NeuralNetworkModel";
import {ClassificationModelStatic, getClassification, IClassification} from "./ClassificationModel";
import {getLogo, LogoModelStatic} from "./LogoModel";

interface IDatabase {
    sequelize: Sequelize;
    User: UserModelStatic;
    Admin: AdminModelStatic;
    Hyperparameters: HyperparametersModelStatic;
    Dataset: DatasetModelStatic;
    NeuralNetwork: NeuralNetworkModelStatic;
    Classification: ClassificationModelStatic;
    Logo: LogoModelStatic;
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
const Classification = getClassification(sequelize);
const Logo = getLogo(sequelize);

User.hasOne(Admin, {
    onDelete: 'CASCADE',
    as: 'Admin',
    foreignKey: 'user_id'
});
Admin.belongsTo(User, {
    onDelete: 'NO ACTION'
});
Dataset.hasMany(NeuralNetwork, {
    onDelete: 'CASCADE',
    as: 'NeuralNetowrks',
    foreignKey: 'dataset_id'
})
NeuralNetwork.belongsTo(Hyperparameters, {
    onDelete: 'CASCADE',
});
Hyperparameters.hasOne(NeuralNetwork, {
    onDelete: 'CASCADE',
    as: 'NeuralNetwork',
    foreignKey: 'hyperparameter_id'
});

Logo.belongsTo(User, {
    onDelete: 'NO ACTION',
    as: 'User'
});
User.hasMany(Logo, {
    onDelete: 'CASCADE',
    as: 'Logos',
    foreignKey: 'user_id'
});

const db: IDatabase = {
    sequelize,
    User,
    Admin,
    Hyperparameters,
    Dataset,
    NeuralNetwork,
    Classification,
    Logo
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
export type ClassificationModel = IClassification;