module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn(
      'users', // tabela na qual a coluna sera criada;
      'avatar_id', // nome da coluna a ser criada;
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    ),

  down: async (queryInterface) =>
    queryInterface.removeColumn('users', 'avatar_id'),
};
