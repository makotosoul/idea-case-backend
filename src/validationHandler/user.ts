import { check } from 'express-validator';
import {
  createBoolValidatorChain,
  createIdValidatorChain,
  validateIdObl,
} from './index.js';

export const validateUserId = [...createIdValidatorChain('userId')];

export const validateUserPost = [
  check('email').notEmpty().withMessage('Email cannot be empty').bail(),
  ...createBoolValidatorChain('isAdmin'),
  ...createBoolValidatorChain('isPlanner'),
  ...createBoolValidatorChain('isStatist'),
];

export const validateUserPut = [...validateIdObl, ...validateUserPost];
