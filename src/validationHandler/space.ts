import { body, check } from 'express-validator';
import { validateIdObl, validateNameObl } from './index.js';
import { createIdValidatorChain } from './index.js';

export const validateSpacePost = [
  ...validateNameObl,
  check('area')
    .isFloat()
    .withMessage('Must be a floating-point number')
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('buildingId')
    .isInt()
    .withMessage('Must be an integer')
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('spaceTypeId')
    .isInt()
    .withMessage('Must be an integer')
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  // Add more validation rules for other space properties
];

export const validateSpaceId = [...createIdValidatorChain('spaceId')];

export const validateSpacePut = [...validateIdObl, ...validateSpacePost];
