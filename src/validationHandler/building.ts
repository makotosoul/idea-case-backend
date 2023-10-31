import { body } from 'express-validator';

import {
  validateDescriptionObl,
  validateId,
  validateNameObl,
} from './index.js';

/* ---- BUILDING ---- */
export const validateBuildingPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateBuildingPut = [...validateBuildingPost, ...validateId];

// This a bit different as body can have multiple objects,
// => MultiPost!!!
export const validateBuildingMultiPost = [
  body('*.name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Must be between 2-255 characters long')
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters, numbers and -')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  body('*.description')
    .isLength({ min: 2, max: 255 })
    .withMessage('Must be between 2-255 characters long')
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters, numbers and -')
    .bail(),
];
