import { validateDescriptionObl, validateNameObl } from './index.js';

export const validateSettingPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];
