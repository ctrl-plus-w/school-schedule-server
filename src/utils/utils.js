export const translateDate = (dbObject) => {
  if (!'created_at' in dbObject || !'updated_at' in dbObject || !'deleted_at' in dbObject)
    return { created_at: null, updated_at: null, deleted_at: null };

  const { created_at, updated_at, deleted_at } = dbObject;
  const toString = (x) => new Date(x).toISOString();

  return {
    created_at: created_at ? toString(created_at) : null,
    updated_at: updated_at ? toString(updated_at) : null,
    deleted_at: deleted_at ? toString(deleted_at) : null,
  };
};

export const formatDbObject = (dbObject) => {
  return {
    ...dbObject.toJSON(),
    ...translateDate(dbObject.toJSON()),
  };
};
