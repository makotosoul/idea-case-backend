import express, { Response, Request } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticationErrorHandler } from '../responseHandler/index.js';

dotenv.config();

export const authenticator = (req: any, res: Response, next: any) => {
  const authHeader = req.headers['authorization']; // or should this be 'x-auth-token'?
  const token = authHeader?.split(' ')[1];

  if (token == null) {
    authenticationErrorHandler(req, res, 'Login TOKEN not found in headers');
  } else {
    jsonwebtoken.verify(
      token,
      process.env.SECRET_TOKEN as string,
      (err: any, user: any) => {
        if (err) {
          authenticationErrorHandler(
            req,
            res,
            'Login token found but NOT valid',
          );
        } else {
          req.user = user;
          req.areRolesRequired = 0;
          // 0:none required, -1:at least one required, 1: role need satisfied
          req.requiredRolesList = [];
          next();
        }
      },
    );
  }
};
