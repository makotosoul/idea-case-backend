import { check } from 'express-validator';

import {
  createIdValidatorChain,
  validateDescriptionObl,
  validateIdObl,
  validateNameObl,
} from './index.js';
import { validateSubjectId } from './subject.js';

export const validateAllocRoundId = [...createIdValidatorChain('allocRoundId')];

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
