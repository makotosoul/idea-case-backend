import { createIdValidatorChain, validateNameObl } from './index.js';

// this needs to continue
export const validateProgramPost = [
  ...validateNameObl,
  ...createIdValidatorChain('departmentId'),
];

export const validateProgramPut = [
  ...validateProgramPost,
  ...createIdValidatorChain('id'),
];

export const validateProgramId = [...createIdValidatorChain('programId')];
