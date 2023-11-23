import { check } from 'express-validator';
import { createIdValidatorChain, validateIdObl } from './index.js';

export const validateUserId = [...createIdValidatorChain('userId')];

export const validateUserPost = [
  check('email').notEmpty().withMessage('Email cannot be empty').bail(),
  check('isAdmin')
    .matches(/[0-1]/)
    .withMessage('Must be a number between 0 and 1')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('isPlanner')
    .matches(/[0-1]/)
    .withMessage('Must be a number between 0 and 1')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('isStatist')
    .matches(/[0-1]/)
    .withMessage('Must be a number between 0 and 1')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
];

export const validateUserPut = [...validateIdObl, ...validateUserPost];
