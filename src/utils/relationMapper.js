import { getDates } from './date';

export const getTableWithUsers = (table) => ({
  ...table.toJSON(),
  ...getDates(table),
  users: () => getUsers(table),
});

export const userObject = (user) => ({
  ...user.toJSON(),
  ...getDates(user),
  subjects: () => getSubjects(user),
  role: () => getRole(user),
  labels: () => getLabels(user),
});

export const eventObject = (event) => ({
  ...event.toJSON(),
  ...getDates(event),
  owner: () => getUser(event),
  label: () => getLabel(event),
  subject: () => getSubject(event),
});

const getLabel = async (model) => {
  const label = await model.getLabel();
  return label ? getTableWithUsers(label) : null;
};

const getSubject = async (model) => {
  const subject = await model.getSubject();
  return subject ? getTableWithUsers(subject) : null;
};

const getUser = async (model) => {
  const user = await model.getUser();
  return user ? userObject(user) : null;
};

export const getLabels = async (model) => {
  const labels = await model.getLabels();
  return labels.map(getTableWithUsers);
};

export const getRole = async (model) => {
  const role = await model.getRole();
  return role ? getTableWithUsers(role) : null;
};

export const getSubjects = async (model) => {
  const subjects = await model.getSubjects();
  return subjects.map(getTableWithUsers);
};

export const getUsers = async (model) => {
  const users = await model.getUsers();
  return users.map(userObject);
};
