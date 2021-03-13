import Sequelize, { Model } from 'sequelize';

class Item extends Model {
  static init(sequelize) {
    super.init(
      {
        unit: Sequelize.INTEGER,
        contract_time: Sequelize.TEXT,
        amount: Sequelize.INTEGER,
        description: Sequelize.TEXT,
        unit_value: Sequelize.DECIMAL,
        installation_value: Sequelize.DECIMAL,
      },
      {
        sequelize,
        modelName: 'item',
        paranoid: true,
      }
    );

    return this;
  }
}
export default Item;
