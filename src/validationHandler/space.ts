import { body, check } from 'express-validator';
import { validateBuildingId } from './building.js';
import {
  createIdValidatorChain,
  createMultiDescriptionValidatorChain,
  createMultiNameValidatorChain,
  createMultiTimeValidatorChain,
  validateIdObl,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';
import { validateSpaceTypeId } from './spaceType.js';

export const validateSpaceId = [...createIdValidatorChain('spaceId')];
export const validateMultiSpaceInfo = [
  ...createMultiDescriptionValidatorChain('info'),
];

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
export const validateMultiSpacePost = [
  ...validateMultiNameObl,
  body('*.area')
    .matches(/^[0-9]*(.[0-9]{1,2})?$/)
    .withMessage('Must be a number')
    .bail()
    .isFloat()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  ...validateMultiSpaceInfo,
  body('*.personLimit')
    .matches(/^[0-9]+$/)
    .withMessage('Must be a number')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  ...createMultiNameValidatorChain('buildingName'),
  ...createMultiTimeValidatorChain('availableFrom'),
  ...createMultiTimeValidatorChain('availableTo'),
  ...createMultiTimeValidatorChain('classesFrom'),
  ...createMultiTimeValidatorChain('classesTo'),
  body('*.inUse')
    .matches(/^(0|1|true|false)$/)
    .withMessage('Must be a boolean value')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  ...createMultiNameValidatorChain('spaceType'),
];
