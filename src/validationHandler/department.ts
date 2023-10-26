import { validateDescriptionObl, validateNameObl } from './index.js';

export const validateDepartmentPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];
