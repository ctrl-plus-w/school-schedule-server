import { DataTypes } from 'sequelize';

const SubjectModel = {
  UUID: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  SubjectName: { type: DataTypes.STRING(255), allowNull: false },
};

export default SubjectModel;
