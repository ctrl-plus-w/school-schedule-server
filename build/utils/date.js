"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetTime = exports.getDates = exports.dateToString = void 0;

const dateToString = date => {
  if (!date) return null;
  return new Date(date).toISOString();
};

exports.dateToString = dateToString;

const getDates = dbObject => {
  const {
    created_at,
    updated_at,
    deleted_at
  } = dbObject;
  return {
    created_at: dateToString(created_at),
    updated_at: dateToString(updated_at),
    deleted_at: dateToString(deleted_at)
  };
};

exports.getDates = getDates;

const resetTime = date => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return new Date(date);
};

exports.resetTime = resetTime;
//# sourceMappingURL=date.js.map