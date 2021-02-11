import Sequelize, { Model } from 'sequelize';

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        city: Sequelize.STRING,
        number: Sequelize.STRING,
        state_registration: Sequelize.STRING,
        complement: Sequelize.STRING,
        google_maps: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  // static associate(models) {
  //   this.belongsToMany(models.Client, {
  //     through: 'AddressClient',
  //     foreignKey: 'client_id',
  //     as: 'clients',
  //   });
  // }
}
export default Address;
