module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('user', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rg: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },

      login: { type: Sequelize.STRING, allowNull: false, unique: true },

      email: { type: Sequelize.STRING, allowNull: false },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      ativo: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false },

      // cliente pode ser o cliente ou prestador de servico
      // cliente: false, prestador: true
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    }),
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  down: async (queryInterface) => queryInterface.dropTable('user'),
};
