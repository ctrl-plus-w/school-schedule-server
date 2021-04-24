"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sequelize) {
    var _sequelize$models, event, label, role, subject, user, user_labels, user_subjects;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _sequelize$models = sequelize.models, event = _sequelize$models.event, label = _sequelize$models.label, role = _sequelize$models.role, subject = _sequelize$models.subject, user = _sequelize$models.user, user_labels = _sequelize$models.user_labels, user_subjects = _sequelize$models.user_subjects; // User / Label relation.

            label.belongsToMany(user, {
              through: user_labels,
              foreignKey: 'label_id',
              otherKey: 'user_id'
            });
            user.belongsToMany(label, {
              through: user_labels,
              foreignKey: 'user_id',
              otherKey: 'label_id'
            }); // Subject / User (owning) relation.

            subject.belongsToMany(user, {
              through: user_subjects,
              foreignKey: 'subject_id',
              other_key: 'user_id'
            });
            user.belongsToMany(subject, {
              through: user_subjects,
              foreignKey: 'user_id',
              other_key: 'subject_id'
            }); // Subject / Event relation.

            subject.hasOne(event);
            event.belongsTo(subject); // Label / Event relation.

            label.hasMany(event);
            event.belongsTo(label); // Subject / Owner relation.

            user.hasOne(event, {
              foreignKey: 'owner_id'
            });
            event.belongsTo(user, {
              foreignKey: 'owner_id'
            }); // User / Role relation.

            role.hasMany(user);
            user.belongsTo(role);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;
//# sourceMappingURL=relations.js.map