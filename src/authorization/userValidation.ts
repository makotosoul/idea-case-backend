import express, { Response, Request } from 'express';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticationErrorHandler } from '../responseHandler/index.js';
import { IncomingHttpHeaders } from 'http';
import logger from '../utils/logger.js';

dotenv.config();

export const authenticator = (req: any, res: Response, next: any) => {
  const authHeader: any = req.get('Authorization');
  //logger.debug("Header: " +req.get('Authorization'))
  //logger.debug("Old version stopped working: ") + req.headers['Authorization'] );
  const token = authHeader?.split(' ')[1]; // Taking the leading 'Bearer' and space ' ' out

  if (token == null) {
    logger.error(`Token: ${token}`);
    authenticationErrorHandler(req, res, 'Login TOKEN not found in headers');
    return;
  } else {
    try {
      const verified = jsonwebtoken.verify(
        token,
        process.env.SECRET_TOKEN as string,
      ) as JwtPayload | string;
      const currentTime = Math.floor(Date.now() / 1000); // Time in seconds
      const iat = typeof verified === 'object' ? verified.iat : 0;

      // Checking if token is older than 1 hour (3600 seconds)
      if (currentTime - (iat || 0) > 3600) {
        authenticationErrorHandler(req, res, 'Token Expired');
        return;
      }

      req.user = verified;
      req.areRolesRequired = 0;
      // 0:none required, -1:at least one required, 1: role need satisfied
      req.requiredRolesList = [];
      next();
    } catch (err) {
      authenticationErrorHandler(req, res, 'Login token found but NOT valid');
    }
  }
};
