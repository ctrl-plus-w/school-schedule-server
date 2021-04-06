import { DataTypes } from 'sequelize';

export default (sequelize) => {
  sequelize.define(
    'role',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      role_name: { type: DataTypes.STRING(255), allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: true },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'Role',
      timestamps: false,
      underscored: true,
    }
  );
};
