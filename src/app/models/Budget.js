import Sequelize, { Model } from 'sequelize';

class Budget extends Model {
  static init(sequelize) {
    super.init(
      {
        velocity: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
    this.belongsTo(models.Address, { foreignKey: 'address_id', as: 'address' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.StatusBudget, {
      foreignKey: 'status_budget_id',
      as: 'status',
    });
  }
}
export default Budget;
