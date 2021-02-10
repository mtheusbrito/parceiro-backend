import Sequelize, { Model } from 'sequelize';

class StatusBudget extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        sequence: Sequelize.INTEGER,
        color: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}
export default StatusBudget;
