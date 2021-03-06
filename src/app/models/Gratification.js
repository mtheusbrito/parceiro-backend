import Sequelize, { Model } from 'sequelize';

class Gratification extends Model {
  static init(sequelize) {
    super.init(
      {
        delivery_date: Sequelize.DATE,
        payment_date: Sequelize.DATE,
        value: Sequelize.DECIMAL,
      },
      {
        sequelize,
        modelName: 'gratification',
        paranoid: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.user, {
      foreignKey: 'created_for_id',
      as: 'created_for',
    });
  }
}
export default Gratification;
