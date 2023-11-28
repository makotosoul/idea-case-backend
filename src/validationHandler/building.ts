import {
  createIdValidatorChain,
  validateDescriptionObl,
  validateIdObl,
  validateMultiDescription,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';

export const validateBuildingId = [...createIdValidatorChain('buildingId')];

export const validateBuildingPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateBuildingPut = [...validateBuildingPost, ...validateIdObl];

// This a bit different as body can have multiple objects,
// => MultiPost!!!
export const validateBuildingMultiPost = [
  ...validateMultiNameObl,
  ...validateMultiDescription,
];
