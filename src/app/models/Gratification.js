import moment from 'moment';
import Sequelize, { Model } from 'sequelize';

class Gratification extends Model {
  static init(sequelize) {
    super.init(
      {
        delivery_date: Sequelize.DATE,
        payment_date: Sequelize.DATE,
        payment: Sequelize.DECIMAL,
      },
      {
        sequelize,
        modelName: 'gratification',
        paranoid: true,
      }
    );
    function formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
    this.addHook('beforeSave', async (gratification) => {
      if (gratification.delivery_date && gratification.payment_date !== '') {
        gratification.delivery_date = formatDate(gratification.delivery_date);
        gratification.payment_date = formatDate(gratification.payment_date);
      }
    });
    return this;
  }
  // data.payment_date = moment(data.payment_date).format("YYYY-MM-DD HH:mm:ss");

  static associate(models) {
    this.belongsTo(models.user, {
      foreignKey: 'created_for_id',
      as: 'created_for',
    });
  }
}
export default Gratification;
