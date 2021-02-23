import Sequelize, { Model } from 'sequelize';

class Configuration extends Model {
  static init(sequelize) {
    super.init(
      { email: Sequelize.STRING },
      { sequelize, modelName: 'configuration' }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.status_budget, {
      foreignKey: 'status_analysis_budgets_id',
      as: 'status_analysis_budgets',
    });

    this.belongsTo(models.status_budget, {
      foreignKey: 'status_completed_sales_id',
      as: 'status_completed_sales',
    });
  }
}
export default Configuration;
