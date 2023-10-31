import {
  validateDescription,
  validateDescriptionObl,
  validateIdObl,
  validateNameObl,
} from './index.js';

export const validateDepartmentPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateDepartmentPut = [
  ...validateDepartmentPost,
  ...validateIdObl,
];

