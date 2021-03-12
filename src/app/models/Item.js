import Sequelize, { Model } from 'sequelize';

class Item extends Model {
  static init(sequelize) {
    super.init(
      {
        unit: Sequelize.STRING,
        amount: Sequelize.NUMBER,
        description: Sequelize.TEXT,
        value: Sequelize.DECIMAL,
        instalation: Sequelize.DECIMAL,
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
