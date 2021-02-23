module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('configuration', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: { type: Sequelize.STRING, allowNull: false },

      status_analysis_budgets_id: {
        type: Sequelize.INTEGER,
        references: { model: 'status_budget', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },

      status_completed_sales_id: {
        type: Sequelize.INTEGER,
        references: { model: 'status_budget', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },

      deleted_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('configuration');
  },
};
