import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        login: Sequelize.STRING,
        email: Sequelize.STRING,
        cpf: Sequelize.STRING,
        rg: Sequelize.STRING,
        phone: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
        ativo: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsToMany(models.Address, {
      through: 'AddressUser',
      foreignKey: 'user_id',
      as: 'adresses',
    });
    this.hasMany(models.Pix, {
      foreignKey: 'user_id',
      as: 'pix_keys',
    });
    this.hasMany(models.BankAccount, {
      foreignKey: 'user_id',
      as: 'bank_accounts',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
