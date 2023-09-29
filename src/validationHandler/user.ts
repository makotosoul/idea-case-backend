import { check } from 'express-validator';
import { validateIdObl } from './index.js';

export const validateUserPut = [
  ...validateIdObl,
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
