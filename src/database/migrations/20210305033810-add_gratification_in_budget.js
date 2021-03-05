module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('budget', 'gratification_id', {
      type: Sequelize.INTEGER,
      references: { model: 'gratification', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('budget', 'gratification_id');
  },
};
