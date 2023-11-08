import {
  createIdValidatorChain,
  validateDescriptionObl,
  validateIdObl,
  validateNameObl,
} from './index.js';

export const validateDepartmentId = [...createIdValidatorChain('departmentId')];

export const validateDepartmentPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateDepartmentPut = [
  ...validateDepartmentPost,
  ...validateIdObl,
];
