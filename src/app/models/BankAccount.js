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
        modelName: 'bank_account',
        paranoid: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.user);
  }
}
export default BankAccount;
