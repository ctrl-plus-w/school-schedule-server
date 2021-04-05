import { DataTypes } from 'sequelize';

const RoleModel = {
  id: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  role_name: { type: DataTypes.STRING(255), allowNull: false },
};

export default RoleModel;
