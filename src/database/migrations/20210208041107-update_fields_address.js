module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('addresses', 'state_registration', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    queryInterface.addColumn('addresses', 'complement', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    queryInterface.addColumn('addresses', 'google_maps', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('addresses', 'state_registration');
    queryInterface.removeColumn('addresses', 'complement');
    queryInterface.removeColumn('addresses', 'google_maps');
  },
};
