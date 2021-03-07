module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('gratification', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      created_for_id: {
        type: Sequelize.INTEGER,
        references: { model: 'user', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      delivery_date: {
        type: Sequelize.DATE,
      },
      payment_date: {
        type: Sequelize.DATE,
      },
      payment: {
        type: Sequelize.DECIMAL(15, 2),
      },
      // Data da venda, data de entrega do cliente, nome do cleinte, valor, Data prevista de pagamento.
      deleted_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('gratification');
  },
};
