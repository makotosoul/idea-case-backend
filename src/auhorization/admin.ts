import express, { Response, Request } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { requestErrorHandler } from '../responseHandler/index.js';

dotenv.config();

export const admin = (req: any, res: Response, next: any) => {
  if (req.user.isAdmin === 0) {
    console.log('admin');
  }

  next();
};
