module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('client', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('client', 'phone');
  },
};
