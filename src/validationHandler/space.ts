import { body, check } from 'express-validator';
import { validateBuildingId } from './building.js';
import { validateIdObl, validateNameObl } from './index.js';
import { createIdValidatorChain } from './index.js';
import { validateSpaceTypeId } from './spaceType.js';

export const validateSpaceId = [...createIdValidatorChain('spaceId')];

export const validateSpacePost = [
  ...validateNameObl,
  check('area')
    .isFloat()
    .withMessage('Must be a floating-point number')
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  ...validateBuildingId,
  ...validateSpaceTypeId,
  // Add more validation rules for other space properties
];

export const validateSpacePut = [...validateIdObl, ...validateSpacePost];
