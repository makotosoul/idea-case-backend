import { check } from 'express-validator';

import {
  validateDescriptionObl,
  validateIdObl,
  validateNameObl,
} from './index.js';
import { validateSubjectId } from './subject.js';

export const validateAllocRoundId = [
  check('allocRoundId')
    .matches(/^[0-9]+$/)
    .withMessage('allocRoundId must be a number')
    .bail()
    .notEmpty()
    .withMessage('allocRoundId cannot be empty')
    .bail(),
];

export const validateAllocRoundIdAndSubjectId = [
  ...validateAllocRoundId,
  ...validateSubjectId,
];

export const validateAllocRoundPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateAllocRoundPut = [
  ...validateIdObl,
  ...validateAllocRoundPost,
];
