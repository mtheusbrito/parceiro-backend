module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('status_budgets', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: { type: Sequelize.STRING, allowNull: false },
      sequence: { type: Sequelize.INTEGER, allowNull: false },
      color: { type: Sequelize.STRING, allowNull: false },

      deleted_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('status_budgets');
  },
};
