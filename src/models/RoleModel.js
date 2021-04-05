import { DataTypes } from 'sequelize';

const RoleModel = {
  UUID: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  RoleName: { type: DataTypes.STRING(255), allowNull: false },
};

export default RoleModel;
