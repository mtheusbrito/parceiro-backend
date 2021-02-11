import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import Client from '../app/models/Client';
import Pix from '../app/models/Pix';
import Address from '../app/models/Address';
import AddressClient from '../app/models/AddressClient';
import AddressUser from '../app/models/AddressUser';
import BankAddress from '../app/models/BankAccount';
import StatusBudget from '../app/models/StatusBudget';
import Budget from '../app/models/Budget';
import databaseConfig from '../config/database';

const models = [
  User,
  File,
  Client,
  Address,
  Pix,
  AddressClient,
  AddressUser,
  BankAddress,
  StatusBudget,
  Budget,
];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
    models.map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
