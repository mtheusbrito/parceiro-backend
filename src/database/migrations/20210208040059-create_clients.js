module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('clients', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      company: { type: Sequelize.STRING, allowNull: false },
      obs: { type: Sequelize.TEXT, allowNull: true },

      cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('clients'),
};
