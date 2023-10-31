import { check } from 'express-validator';
import {
  validateDescriptionObl,
  validateId,
  validateNameObl,
  validatePriorityMustBeNumber,
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

export const validateEquipmentPut = [...validateEquipmentPost, ...validateId];
