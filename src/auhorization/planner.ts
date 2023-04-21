import express, { Response, Request } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const planner = (req: any, res: Response, next: any) => {
  if (req.user.isPlanner === 0 && req.user.isAdmin === 0) {
    console.log('planner');
    return res.sendStatus(403);
  }

  next();
};
