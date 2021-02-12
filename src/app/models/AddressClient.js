import Sequelize, { Model } from 'sequelize';

class AddressClient extends Model {
  static init(sequelize) {
    super.init(
      {
        client_id: Sequelize.INTEGER,
        address_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Client, {
      foreignKey: 'client_id',
    });
    this.belongsTo(models.Address, {
      foreignKey: 'address_id',
    });
  }
}
export default AddressClient;
