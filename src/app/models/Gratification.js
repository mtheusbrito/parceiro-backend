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
    this.belongsTo(models.budget, { foreignKey: 'budget_id', as: 'budget' });
    this.belongsTo(models.user, {
      foreignKey: 'created_for_id',
      as: 'created_for',
    });
    this.belongsTo(models.user, { foreignKey: 'user_id', as: 'user' });
  }
}
export default Gratification;
