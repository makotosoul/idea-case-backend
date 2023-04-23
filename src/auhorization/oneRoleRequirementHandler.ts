import { Response } from 'express';

export const oneRoleRequirementHandler = (
  req: any,
  res: Response,
  next: any,
  roleName: string,
) => {
  req.requiredRolesList.push(roleName);
  let rolePropertyName = `is${roleName
    .substring(0, 1)
    .toUpperCase()}${roleName.substring(1)}`;
  if (req.user[rolePropertyName] === 1) {
    req.areRolesRequired = 1;
    console.log('roleName');
  } else {
    if (req.areRolesRequired === 0) {
      req.areRolesRequired = -1;
    } else {
      // req.areRolesRequired must have already been 1
    }
  }

  next(); // No matter what we go to next role handler or roleChecker
};
