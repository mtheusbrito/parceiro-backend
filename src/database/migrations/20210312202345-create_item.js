module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('item', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      budget_id: {
        type: Sequelize.INTEGER,
        references: { model: 'budget', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      unit: { type: Sequelize.STRING, allowNull: false },
      contract_time: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.INTEGER, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      unit_value: {
        type: Sequelize.DECIMAL(15, 2),
      },

      instalation_value: {
        type: Sequelize.DECIMAL(15, 2),
      },

      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    }),

  down: async (queryInterface) => queryInterface.dropTable('item'),
};
