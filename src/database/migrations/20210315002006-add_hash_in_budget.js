module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('budget', 'hash', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('budget', 'hash');
  },
};
