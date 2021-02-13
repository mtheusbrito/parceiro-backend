module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('client', 'user_id', {
      type: Sequelize.INTEGER,
      references: { model: 'user', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('client', 'user_id');
  },
};
