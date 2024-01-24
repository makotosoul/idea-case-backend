import {
  createIdValidatorChain,
  validateDescription,
  validateIdObl,
  validateNameObl,
} from './index.js';

export const validateDepartmentId = [...createIdValidatorChain('departmentId')];

export const validateDepartmentPost = [
  ...validateNameObl,
  ...validateDescription,
];

export const validateDepartmentPut = [
  ...validateDepartmentPost,
  ...validateIdObl,
];
