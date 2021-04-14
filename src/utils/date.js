export const dateToString = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

export const getDates = (dbObject) => {
  const { created_at, updated_at, deleted_at } = dbObject;

  return {
    created_at: dateToString(created_at),
    updated_at: dateToString(updated_at),
    deleted_at: dateToString(deleted_at),
  };
};

export const resetTime = (date) => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return new Date(date);
};
