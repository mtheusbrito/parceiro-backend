import Sequelize, { Model } from 'sequelize';

class Pix extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
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
export default Pix;