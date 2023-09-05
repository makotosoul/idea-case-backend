import {
  validateIdObl,
  validateNameObl,
  validateDescriptionObl,
} from './index.js';

export const validateAllocRoundPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateAllocRoundPut = [
  ...validateIdObl,
  ...validateAllocRoundPost,
];
