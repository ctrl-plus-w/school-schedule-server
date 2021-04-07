import { dateToString } from './date';

// TODO : Optimize 'created_at', 'updated_at' and 'deleted_at' toString function.

export const getTableWithUsers = (table) => ({
  ...table.toJSON(),
  created_at: dateToString(table.created_at),
  deleted_at: dateToString(table.deleted_at),
  updated_at: dateToString(table.updated_at),
  users: () => getUsers(table),
});

export const userObject = (user) => ({
  ...user.toJSON(),
  created_at: dateToString(user.created_at),
  deleted_at: dateToString(user.deleted_at),
  updated_at: dateToString(user.updated_at),
  subjects: () => getSubjects(user),
  role: () => getRole(user),
  labels: () => getLabels(user),
});

export const getLabels = async (user) => {
  const labels = await user.getLabels();
  return labels.map(getTableWithUsers);
};

export const getRole = async (user) => {
  const role = await user.getRole();
  return role ? getTableWithUsers(role) : null;
};

export const getSubjects = async (user) => {
  const subjects = await user.getSubjects();
  return subjects.map(getTableWithUsers);
};

export const getUsers = async (table) => {
  const users = await table.getUsers();
  return users.map(userObject);
};
