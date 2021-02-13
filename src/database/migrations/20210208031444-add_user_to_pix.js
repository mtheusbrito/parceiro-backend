module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('pix', 'user_id', {
      type: Sequelize.INTEGER,
      references: { model: 'user', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: async (queryInterface) => queryInterface.removeColumn('pix', 'user_id'),
};
