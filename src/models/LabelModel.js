import { DataTypes } from 'sequelize';

const LabelModel = {
  id: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  label_name: { type: DataTypes.STRING(255), allowNull: false },
  subject_id: { type: DataTypes.INTEGER, allowNull: false },
};

export default LabelModel;
