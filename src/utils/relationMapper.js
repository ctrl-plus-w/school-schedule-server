export const mapResult = (table) => ({
  ...table.toJSON(),
  users: () => getUsers(table),
});

export const userObject = (user) => ({
  ...user.toJSON(),
  subjects: () => getSubjects(user),
  role: () => getRole(user),
  labels: () => getLabels(user),
});

export const getLabels = async (user) => {
  const labels = await user.getLabels();
  return labels.map(mapResult);
};

export const getRole = async (user) => {
  const role = await user.getRole();
  return role ? mapResult(role) : null;
};

export const getSubjects = async (user) => {
  const subjects = await user.getSubjects();
  return subjects.map(mapResult);
};

export const getUsers = async (table) => {
  const users = await table.getUsers();
  return users.map(userObject);
};
