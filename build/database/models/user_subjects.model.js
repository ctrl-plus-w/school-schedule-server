"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _default = function _default(sequelize) {
  sequelize.define('user_subjects', {
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
    tableName: 'UserSubjects',
    timestamps: false,
    underscored: true
  });
};

exports["default"] = _default;
//# sourceMappingURL=user_subjects.model.js.map