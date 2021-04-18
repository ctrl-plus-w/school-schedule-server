import errors from '../config/errors';
import config from '../config';

const eq = (role, configRole) => role === config.ROLES[configRole];

export const checkIsProfessor = (user) => {
  if (!user) throw new Error(errors.DEFAULT);
  if (!eq(user.role.role_name, 'PROFESSOR') && !eq(user.role.role_name, 'ADMIN')) throw new Error(errors.NOT_ALLOWED);

  return true;
};

export const checkIsAdmin = (user) => {
  if (!user) throw new Error(errors.DEFAULT);
  if (!eq(user.role.role_name, 'ADMIN')) throw new Error(errors.NOT_ALLOWED);

  return true;
};
