import Sequelize, { Model } from 'sequelize';

class Client extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        obs: Sequelize.TEXT,
        company: Sequelize.STRING,
        phone: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'client',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.user, { foreignKey: 'user_id', as: 'user' });
    this.belongsToMany(models.address, {
      through: 'client_address',
      foreignKey: 'client_id',
      as: 'addresses',
    });
  }
}
export default Client;
