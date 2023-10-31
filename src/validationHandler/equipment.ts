import { check } from 'express-validator';
import {
  validateDescriptionObl,
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
