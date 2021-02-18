module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('address', 'cep', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('address', 'cep');
  },
};
