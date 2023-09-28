import { Response } from 'express';
import { oneRoleRequirementHandler } from './oneRoleRequirementHandler.js';

export const planner = (req: any, res: Response, next: any) => {
  oneRoleRequirementHandler(req, res, next, 'planner');
};
