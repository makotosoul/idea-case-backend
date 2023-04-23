import { Response } from 'express';

export const admin = (req: any, res: Response, next: any) => {
  if (req.user.isAdmin === 1) {
    req.areRolesRequired = 1;
    console.log('admin');
  } else {
    if (req.areRolesRequired === 0) {
      req.areRolesRequired = -1;
    } else {
      // req.areRolesRequired must have already been 1
    }
  }

  next(); // No matter what we go to next role handler or roleChecker
};
