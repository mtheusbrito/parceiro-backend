import Sequelize, { Model } from 'sequelize';

class StatusBudget extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        sequence: Sequelize.INTEGER,
        color: Sequelize.STRING,
        value: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.id;
          },
        },
        label: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.name;
          },
        },
      },
      {
        sequelize,
        modelName: 'status_budget',
        paranoid: true,
      }
    );

    return this;
  }
}
export default StatusBudget;
