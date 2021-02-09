/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // console.log(decoded);
    req.userId = decoded.id;
    req.userAdmin = decoded.admin;

    const { admin } = decoded;

    if (!admin) {
      return res.status(403).json({ error: `Access Denied` });
    }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};