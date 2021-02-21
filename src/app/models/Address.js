import Sequelize, { Model } from 'sequelize';

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        city: Sequelize.STRING,
        cep: Sequelize.STRING,
        number: Sequelize.STRING,
        state_registration: Sequelize.STRING,
        complement: Sequelize.STRING,
        google_maps: Sequelize.STRING,
        value: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.id;
          },
        },
        label: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${this.name} ,${this.number} ,${this.city} - CEP ${this.cep}.`;
          },
        },
      },
      {
        sequelize,
        modelName: 'address',
      }
    );
    return this;
  }

  // static associate(models) {
  //   this.belongsToMany(models.Client, {
  //     through: 'clientsaddress_',
  //     foreignKey: 'client_id',
  //     as: 'client',
  //   });
  // }
}
export default Address;
