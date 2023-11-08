import {
  createIdValidatorChain,
  validateDescriptionObl,
  validateIdObl,
  validateNameObl,
} from './index.js';

export const validateDepartmentId = [...createIdValidatorChain('departmentId')];
export const validateDepartmentPost = [...validateNameObl];

export const validateDepartmentPut = [
  ...validateDepartmentPost,
  ...validateIdObl,
];
