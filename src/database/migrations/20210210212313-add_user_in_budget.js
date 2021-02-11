module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('budgets', 'user_id', {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('budgets', 'user_id');
  },
};
