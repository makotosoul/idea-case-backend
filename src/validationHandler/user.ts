import { check } from 'express-validator';
import {
  createIdValidatorChain,
  createRoleValidatorChain,
  validateIdObl,
} from './index.js';

export const validateUserId = [...createIdValidatorChain('userId')];

export const validateUserPost = [
  check('email').notEmpty().withMessage('Email cannot be empty').bail(),
  ...createRoleValidatorChain('isAdmin'),
  ...createRoleValidatorChain('isPlanner'),
  ...createRoleValidatorChain('isStatist'),
];

export const validateUserPut = [...validateIdObl, ...validateUserPost];
