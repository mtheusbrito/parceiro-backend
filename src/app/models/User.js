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
        modelName: 'user',
        paranoid: true,
      }
    );
    this.addHook('beforeSave', async (user) => {
      if (user.password && user.password !== '') {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    // console.log(models);
    this.belongsTo(models.file, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsToMany(models.address, {
      through: 'user_address',
      foreignKey: 'user_id',
      as: 'addresses',
    });
    this.hasMany(models.pix, {
      foreignKey: 'user_id',
      as: 'pixes',
    });
    this.hasMany(models.bank_account, {
      foreignKey: 'user_id',
      as: 'accounts',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
