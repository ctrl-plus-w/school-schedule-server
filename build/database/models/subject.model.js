"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = require("sequelize");

var _default = sequelize => {
  sequelize.define('subject', {
    id: {
      type: _sequelize.DataTypes.UUID,
      defaultValue: _sequelize.DataTypes.UUIDV4,
      primaryKey: true
    },
    subject_name: {
      type: _sequelize.DataTypes.STRING(255),
      allowNull: false
    },
    color: {
      type: _sequelize.DataTypes.STRING(255),
      allowNull: false,
      default: 'red'
    },
    created_at: {
      type: _sequelize.DataTypes.DATE,
      defaultValue: _sequelize.DataTypes.NOW
    },
    updated_at: {
      type: _sequelize.DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: _sequelize.DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Subject',
    timestamps: false,
    underscored: true
  });
};

exports.default = _default;
//# sourceMappingURL=subject.model.js.map