import express, { Response, Request } from 'express';
import { authorizationErrorHandler } from '../responseHandler/index.js';

export const roleListPrinter = (req: any): string => {
  let rolesListText = 'Roles accepted: ';
  req.requiredRolesList.forEach((element: string) => {
    rolesListText += `${element} `;
  });

  return rolesListText;
};

export const roleChecker = (req: any, res: Response, next: any) => {
  if (req.areRolesRequired !== 0 && req.areRolesRequired !== 1) {
    // areRolesRequired is then supposed to be -1 = roles required, but none of the roles were present
    if (req.areRolesRequired === -1) {
      authorizationErrorHandler(
        req,
        res,
        `Roles missing, ${roleListPrinter(req)}`,
      );
    } else {
      authorizationErrorHandler(
        req,
        res,
        'Voe tokkiinsa. Role checking has some programming error!',
      );
    }
  } else {
    console.debug(
      `Role check success! Roles required were: ${roleListPrinter(req)}`,
    );
    next();
  }
};
