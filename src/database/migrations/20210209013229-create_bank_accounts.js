module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bank_account', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { type: Sequelize.STRING, allowNull: true },
      type: { type: Sequelize.STRING, allowNull: true },
      agency: { type: Sequelize.STRING, allowNull: false },
      number: { type: Sequelize.STRING, allowNull: false },
      operation: { type: Sequelize.STRING, allowNull: true },

      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'user', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('bank_account'),
};
