const config = {
  DB_URL: process.env.DB_URL,

  JWT_KEY: process.env.JWT_KEY,
  JWT_TOKEN_EXPIRATION: 1,

  ROLES: {
    PROFESSOR: 'Enseignant',
    STUDENT: 'Élève',
    ADMIN: 'Admin',
  },
};

export default config;
