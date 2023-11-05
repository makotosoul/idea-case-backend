import { createIdValidatorChain } from './index.js';

export const validateUserId = [...createIdValidatorChain('userId')];
export const validateDepartmentId = [...createIdValidatorChain('departmentId')];

export const validateUserIdAndDepartmentId = [
  ...validateUserId,
  ...validateDepartmentId,
];
