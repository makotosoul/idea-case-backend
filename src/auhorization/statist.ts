import express, { Response, Request } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const statist = (req: any, res: Response, next: any) => {
  if (
    req.user.isStatist === 0 &&
    req.user.isAdmin === 0 &&
    req.user.isPlanner === 0
  ) {
    console.log('statist');
    return res.sendStatus(403);
  }

  next();
};
