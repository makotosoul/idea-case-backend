import {
  validateDescriptionObl,
  validateId,
  validateNameObl,
} from './index.js';

export const validateSettingPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateSettingPut = [...validateSettingPost, ...validateId];
