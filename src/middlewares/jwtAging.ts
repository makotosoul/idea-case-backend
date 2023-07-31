import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

interface RequestWithUser extends Request {
  user?: Record<string, any> | string;
}

const verifyJwtAndCheckExpiration = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers['authorization']?.split('Bearer ')[1];

  if (token) {
    try {
      const verified = jwt.verify(token, process.env.SECRET_TOKEN as string) as
        | JwtPayload
        | string;
      const currentTime = Math.floor(Date.now() / 1000); // Time in seconds
      const iat = typeof verified === 'object' ? verified.iat : 0;

      // Checking if token is older than 60 minutes(3600 seconds) (if we want shorter for example 20min put 1200 seconds)
      if (currentTime - (iat || 0) > 3600) {
        logger.warn('Token Expired');
        res.status(401).send('Token Expired');
        return;
      }

      logger.info('Token Verified Successfully');
      req.user = verified;
    } catch (err: any) {
      logger.error(`Invalid Token: ${err.message}`);
      res.status(403).send('Invalid Token');
      return;
    }
  }

  next();
};

export default verifyJwtAndCheckExpiration;
