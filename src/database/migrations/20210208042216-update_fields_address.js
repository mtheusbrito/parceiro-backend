module.exports = {
  up: async (queryInterface) => {
    queryInterface.removeColumn('address', 'user_id');
  },

  down: async () => {},
};
