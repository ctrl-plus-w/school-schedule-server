import { DataTypes } from 'sequelize';

const LabelModel = {
  UUID: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  LabelName: { type: DataTypes.STRING(255), allowNull: false },
  // TODO : Relation w/ Subject.
};

export default LabelModel;
