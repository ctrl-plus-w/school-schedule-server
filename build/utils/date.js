"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetTime = exports.getDates = exports.dateToString = void 0;

var dateToString = function dateToString(date) {
  if (!date) return null;
  return new Date(date).toISOString();
};

exports.dateToString = dateToString;

var getDates = function getDates(dbObject) {
  var created_at = dbObject.created_at,
      updated_at = dbObject.updated_at,
      deleted_at = dbObject.deleted_at;
  return {
    created_at: dateToString(created_at),
    updated_at: dateToString(updated_at),
    deleted_at: dateToString(deleted_at)
  };
};

exports.getDates = getDates;

var resetTime = function resetTime(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return new Date(date);
};

exports.resetTime = resetTime;
//# sourceMappingURL=date.js.map