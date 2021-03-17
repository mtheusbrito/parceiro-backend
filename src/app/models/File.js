import Sequelize, { Model } from 'sequelize';

require('dotenv').config();

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.URL_API}files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        modelName: 'file',
        paranoid: true,
      }
    );
    return this;
  }
}
export default File;
