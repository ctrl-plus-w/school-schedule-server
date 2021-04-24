"use strict";

require("core-js/modules/es.promise.js");

var _database = _interopRequireDefault(require("../database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(async () => {
  await _database.default.sync({
    alter: true
  });
})();
//# sourceMappingURL=sync.js.map