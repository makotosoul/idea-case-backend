import { validateIdObl, validateNameObl } from './index.js';

// this needs to continue
export const validateProgramPost = [...validateNameObl];
export const validateProgramPut = [...validateProgramPost, ...validateIdObl];
