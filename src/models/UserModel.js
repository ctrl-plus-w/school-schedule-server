import { DataTypes } from 'sequelize';

const UserModel = {
  id: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  full_name: { type: DataTypes.STRING(255), allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false },
};

export default UserModel;
