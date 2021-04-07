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
