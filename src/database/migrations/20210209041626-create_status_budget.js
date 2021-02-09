module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('status_budget', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { allowNull: false, type: Sequelize.STRING },
      order: { allowNull: false, type: Sequelize.INTEGER },
      color: { allowNull: false, type: Sequelize.STRING },

      deleted_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('status_budget');
  },
};
