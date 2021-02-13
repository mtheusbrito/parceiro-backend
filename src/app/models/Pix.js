import Sequelize, { Model } from 'sequelize';

class Pix extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'pix',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.user);
  }
}
export default Pix;
