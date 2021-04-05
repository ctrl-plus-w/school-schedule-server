import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT,

  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
};

export default config;
