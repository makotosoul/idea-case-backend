import { Response } from 'express';

export const planner = (req: any, res: Response, next: any) => {
  req.requiredRolesList.push('planner');
  if (req.user.isPlanner === 1) {
    req.areRolesRequired = 1;
    console.log('planner');
  } else {
    if (req.areRolesRequired === 0) {
      req.areRolesRequired = -1;
    } else {
      // req.areRolesRequired must have already been 1
    }
  }

  next(); // No matter what we go to next role handler or roleChecker
};
