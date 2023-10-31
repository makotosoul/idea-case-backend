import {
  createIdValidatorChain,
  validateIdObl,
  validateNameObl,
} from './index.js';

// this needs to continue
export const validateProgramPost = [
  ...validateNameObl,
  ...createIdValidatorChain('departmentId'),
];
export const validateProgramPut = [...validateProgramPost, ...validateIdObl];
