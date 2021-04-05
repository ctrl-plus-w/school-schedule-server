import { DataTypes } from 'sequelize';

const SubjectModel = {
  id: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  subject_name: { type: DataTypes.STRING(255), allowNull: false },
};

export default SubjectModel;
