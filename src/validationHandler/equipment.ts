import { body, check } from 'express-validator';
import {
  createIdValidatorChain,
  validateDescriptionObl,
  validateIdObl,
  validateMultiDescription,
  validateMultiNameObl,
  validateMultiPriorityMustBeNumber,
  validateNameObl,
  validatePriorityMustBeNumber,
} from './index.js';

export const validateEquipmentId = [...createIdValidatorChain('equipmentId')];

export const validateEquipmentPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
  ...validatePriorityMustBeNumber,
  check('isMovable')
    .matches(/^[01]$/)
    .withMessage('isMovable needs to be 1 = can be moved, 0 = cannot be moved.')
    .bail(),
];

export const validateEquipmentPut = [
  ...validateEquipmentPost,
  ...validateIdObl,
];

export const validateEquipmentMultiPost = [
  ...validateMultiNameObl,
  body('*.isMovable')
    .matches(/^[01]$/)
    .withMessage('isMovable needs to be 1 = can be moved, 0 = cannot be moved.')
    .bail(),
  ...validateMultiPriorityMustBeNumber,
  ...validateMultiDescription,
];
