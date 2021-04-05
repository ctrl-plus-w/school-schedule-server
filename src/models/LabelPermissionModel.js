import { DataTypes } from 'sequelize';

const LabelPermissionModel = {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  label_id: { type: DataTypes.INTEGER, allowNull: false },
};

export default LabelPermissionModel;
