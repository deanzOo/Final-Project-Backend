import {ContainerBuilder} from "node-dependency-injection";
import * as mysql from 'mysql';
export interface User {
    id: number,
    phone: string,
    password: string,
    email?: string,
    firstname?: string,
    lastname?: string
}

export class UserModel {
    private static instance:UserModel = null;
    private DIContainer: ContainerBuilder;
    private table_name;
    private constructor(DIContainer: ContainerBuilder) {
        this.table_name = 'users';
        this.DIContainer = DIContainer;
    }
    static getInstance(DIContainer: ContainerBuilder) {
        return this.instance ?? (this.instance = new UserModel(DIContainer));
    }

    getUsers(options = {}) {
        const db: mysql.Connection = this.DIContainer.get('db');
        db.query('SELECT * FROM ' + this.table_name, (err, result) => {
            if (err)
                options['res'].status(400).json();
            else {
                const users = result.map(user => delete user.password);
                options['res'].status(200).json(users);
            }
        });
    }
}