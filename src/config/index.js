const DEV_DB_URL = 'mysql://root:!FreshRoot1@localhost:3306/school';

const config = {
  DB_URL: process.env.DB_URL || DEV_DB_URL,

  JWT_KEY: process.env.JWT_KEY || '6e;@B"7UdSyE5!s:',
  JWT_TOKEN_EXPIRATION: 1,

  ROLES: {
    PROFESSOR: 'Enseignant',
    STUDENT: 'Élève',
    ADMIN: 'Admin',
  },
};

export default config;
