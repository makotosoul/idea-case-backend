import {
  createIdValidatorChain,
  validateDescriptionObl,
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
  ...createIdValidatorChain('id'),
  ...validateAllocRoundPost,
];
