import { check, body } from 'express-validator';
import {
  validateDescriptionObl,
  validateIdObl,
  validateNameObl,
  validatePriorityMustBeNumber,
  validateMultiNameObl,
  validateMultiPriorityMustBeNumber,
  validateMultiDescription
} from './index.js';

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
  ...validateMultiDescription
];