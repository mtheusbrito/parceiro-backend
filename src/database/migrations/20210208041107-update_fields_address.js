module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('address', 'state_registration', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    queryInterface.addColumn('address', 'complement', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    queryInterface.addColumn('address', 'google_maps', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('address', 'state_registration');
    queryInterface.removeColumn('address', 'complement');
    queryInterface.removeColumn('address', 'google_maps');
  },
};
