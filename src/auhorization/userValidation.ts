import express, { Response, Request } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticator = (req: any, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jsonwebtoken.verify(
    token,
    process.env.SECRET_TOKEN as string,
    (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    },
  );
};
