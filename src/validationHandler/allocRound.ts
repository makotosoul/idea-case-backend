import {
  validateDescriptionObl,
  validateIdObl,
  validateNameObl,
} from './index.js';

export const validateAllocRoundPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateAllocRoundPut = [
  ...validateIdObl,
  ...validateAllocRoundPost,
];
