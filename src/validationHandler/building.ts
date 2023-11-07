import { body } from 'express-validator';

import {
  validateDescriptionObl,
  validateIdObl,
  validateMultiDescriptionObl,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';

/* ---- BUILDING ---- */
export const validateBuildingPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateBuildingPut = [...validateBuildingPost, ...validateIdObl];

// This a bit different as body can have multiple objects,
// => MultiPost!!!
export const validateBuildingMultiPost = [
  ...validateMultiNameObl,
  ...validateMultiDescriptionObl,
];
