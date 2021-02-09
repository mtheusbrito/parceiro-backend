import Sequelize, { Model } from 'sequelize';

class Client extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        obs: Sequelize.TEXT,
        company: Sequelize.VIRTUAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Address, {
      through: 'AddressClient',
      foreignKey: 'client_id',
      as: 'adresses',
    });
  }
}
export default Client;
