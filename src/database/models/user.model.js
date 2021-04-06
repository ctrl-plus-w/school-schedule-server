import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'user',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      full_name: { type: DataTypes.STRING(255), allowNull: false },
      password: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'User',
    }
  );
};
