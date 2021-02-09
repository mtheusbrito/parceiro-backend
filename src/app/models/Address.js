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
}
export default Address;
