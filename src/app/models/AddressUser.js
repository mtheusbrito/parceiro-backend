import Sequelize, { Model } from 'sequelize';

class AddressUser extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        address_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
    this.belongsTo(models.Address, {
      foreignKey: 'address_id',
    });
  }
}
export default AddressUser;
