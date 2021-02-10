module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('address_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'addresses', key: 'id' },
      },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('address_users');
  },
};
