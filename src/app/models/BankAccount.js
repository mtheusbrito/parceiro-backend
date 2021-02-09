import Sequelize, { Model } from 'sequelize';

class BankAccount extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        type: Sequelize.STRING,
        agency: Sequelize.STRING,
        number: Sequelize.STRING,
        operation: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User);
  }
}
export default BankAccount;
