module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('budget', 'update_for_id', {
      type: Sequelize.INTEGER,
      references: { model: 'user', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: async (queryInterface) =>
    queryInterface.removeColumn('budget', 'update_for_id'),
};
