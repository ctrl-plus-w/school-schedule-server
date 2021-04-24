"use strict";

var _database = _interopRequireDefault(require("../database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var subjects = [// Sciences
'Maths', 'Sciences', // Littérature
'Français', 'Histoire Géo', 'EMC', // Langues
'Anglais', 'Espagnol', 'Allemand', // Autres
'EPS', 'Orientation', 'AP', 'Vie de classe', // Spés
'SpéNSI', 'SpéMaths', 'SpéAnglais', 'SpéNSI', 'SpéPhysique', 'SpéSVT'];
var labels = [// Classes
'1ère1', '1ère2', '1ère3', '1ère4', '1ère5', '1ère6', '2nd1', '2nd2', '2nd3', '2nd4', '2nd5', '2nd6', 'Term1', 'Term2', 'Term3', 'Term4', 'Term5', 'Term6'];

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _database["default"].models.subject.bulkCreate(subjects.map(function (subject) {
            return {
              subject_name: subject
            };
          }));

        case 2:
          _context.next = 4;
          return _database["default"].models.label.bulkCreate(labels.map(function (label) {
            return {
              label_name: label
            };
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();
//# sourceMappingURL=seed.js.map