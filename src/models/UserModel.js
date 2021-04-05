import { DataTypes } from 'sequelize';

const UserModel = {
  UUID: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  FullName: { type: DataTypes.STRING(255), allowNull: false },
  // TODO : Relation w/ Role.
};

export default UserModel;
