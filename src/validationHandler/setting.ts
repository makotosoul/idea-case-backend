import {
  validateDescription,
  validateIdObl,
  validateNameObl,
} from './index.js';

export const validateSettingPost = [...validateNameObl, ...validateDescription];

export const validateSettingPut = [...validateSettingPost, ...validateIdObl];
