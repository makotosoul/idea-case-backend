import {
  createIdValidatorChain,
  validateDescriptionObl,
  validateIdObl,
  validateNameObl,
} from './index.js';
import { validateUserId } from './user.js';

export const validateAllocRoundId = [...createIdValidatorChain('allocRoundId')];
export const validateCopiedAllocRoundId = [
  ...createIdValidatorChain('copiedAllocRoundId'),
];

export const validateAllocRoundPost = [
  ...validateNameObl,
  //...validateUserId,
  ...validateDescriptionObl,
];

export const validateAllocRoundCopyPost = [
  ...validateAllocRoundPost,
  ...validateUserId,
  ...validateCopiedAllocRoundId,
];

export const validateAllocRoundPut = [
  ...validateIdObl,
  ...validateAllocRoundPost,
];
