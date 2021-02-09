import Sequelize, { Model } from 'sequelize';

class StatusBudget extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        color: Sequelize.STRING,
        order: Sequelize.INT,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}
export default StatusBudget;
