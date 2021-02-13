import Sequelize, { Model } from 'sequelize';

class Budget extends Model {
  static init(sequelize) {
    super.init(
      {
        velocity: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'budget',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.client, { foreignKey: 'client_id', as: 'client' });
    this.belongsTo(models.address, { foreignKey: 'address_id', as: 'address' });
    this.belongsTo(models.user, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.status_budget, {
      foreignKey: 'status_budget_id',
      as: 'status',
    });
  }
}
export default Budget;
