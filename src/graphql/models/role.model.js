import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'role',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      role_name: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'Role',
    }
  );
};
