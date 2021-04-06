import jwt from 'jsonwebtoken';

import config from '../config';

export default async (req, res, next) => {
  const leave = () => {
    req.isAuth = false;
    return next();
  };

  const pass = (id) => {
    req.isAuth = true;
    req.user_id = id;
    return next();
  };

  const authHeader = await req.get('Authorization');
  if (!authHeader) return leave();

  const token = await authHeader.split(' ')[1];
  if (!token || token === '') return leave();

  try {
    const decodedToken = jwt.verify(token, config.JWT_KEY);
    if (!decodedToken) return leave();

    return pass(decodedToken.user_id);
  } catch (err) {
    return leave();
  }
};
