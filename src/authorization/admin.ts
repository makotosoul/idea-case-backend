import { Response } from 'express';
import { oneRoleRequirementHandler } from './oneRoleRequirementHandler.js';

export const admin = (req: any, res: Response, next: any) => {
  oneRoleRequirementHandler(req, res, next, 'admin');
};
