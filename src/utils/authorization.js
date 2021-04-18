import errors from '../config/errors';
import config from '../config';

export const role = (user) => user.role.role_name;

export const isProfessor = (role) => role === config.ROLES.PROFESSOR || role === config.ROLES.ADMIN;
export const isAdmin = (role) => role === config.ROLES.ADMIN;

export const checkIsProfessor = (user) => {
  return new Promise((resolve, reject) => {
    if (!user) reject(errors.DEFAULT);
    if (!isProfessor(role(user))) reject(errors.NOT_ALLOWED);
    resolve();
  });
};

export const checkIsAdmin = (user) => {
  return new Promise((resolve, reject) => {
    console.log(user.toJSON());
    if (!user) reject(errors.DEFAULT);
    if (!isAdmin(role(user))) reject(errors.NOT_ALLOWED);
    resolve();
  });
};
