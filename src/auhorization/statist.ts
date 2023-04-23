import { Response } from 'express';

export const statist = (req: any, res: Response, next: any) => {
  if (req.user.isStatist === 1) {
    req.areRolesRequired = 1;
    console.log('statist');
  } else {
    if (req.areRolesRequired === 0) {
      req.areRolesRequired = -1;
    } else {
      // req.areRolesRequired must have already been 1
    }
  }

  next(); // No matter what we go to next role handler or roleChecker
};
