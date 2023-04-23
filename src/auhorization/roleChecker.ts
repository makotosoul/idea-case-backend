import express, { Response, Request } from 'express';
import { authorizationErrorHandler } from '../responseHandler/index.js';

export const roleChecker = (req: any, res: Response, next: any) => {
  if (req.areRolesRequired !== 0 && req.areRolesRequired !== 1) {
    // areRolesRequired is then supposed to be -1 = roles required, but none of the roles were present
    if (req.areRolesRequired === -1) {
      let rolesListText = 'Roles asked [';
      req.requiredRolesList.forEach((element: string) => {
        rolesListText += `${element} `;
      });
      rolesListText += ']';

      authorizationErrorHandler(req, res, `Roles missing, ${rolesListText}`);
    } else {
      authorizationErrorHandler(
        req,
        res,
        'Voe tokkiinsa. Role checking has some programming error!',
      );
    }
  } else {
    console.debug('Role check successful!');
    next();
  }
};
