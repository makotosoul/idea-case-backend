import {
  createIdValidatorChain,
  validateDescription,
  validateIdObl,
  validateMultiDescription,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';

export const validateSpaceTypeId = [...createIdValidatorChain('spaceTypeId')];

export const validateSpaceTypePost = [
  ...validateNameObl,
  ...validateDescription,
];

export const validateSpaceTypePut = [
  ...validateSpaceTypePost,
  ...validateIdObl,
];

//I got the below code from building.ts and it had the following comments on it, so I'm copying them over -Vivienne

// This is a bit different as body can have multiple objects,
// => MultiPost!!!
export const validateSpaceTypeMultiPost = [
  ...validateMultiNameObl,
  ...validateMultiDescription,
];
