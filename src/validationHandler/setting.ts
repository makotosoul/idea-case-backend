import {
  validateDescriptionObl,
  validateIdObl,
  validateNameObl,
} from './index.js';

export const validateSettingPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateSettingPut = [...validateSettingPost, ...validateIdObl];
