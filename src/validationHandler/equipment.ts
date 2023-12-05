import {
  createBoolValidatorChain,
  createIdValidatorChain,
  createMultiBoolValidatorChain,
  createMultiNumberValidatorChain,
  createNumberValidatorChain,
  validateDescriptionObl,
  validateIdObl,
  validateMultiDescription,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';

export const validateEquipmentId = [...createIdValidatorChain('equipmentId')];

export const validateEquipmentPost = [
  ...validateNameObl,
  ...validateDescriptionObl,
  ...createNumberValidatorChain('Priority'),
  ...createBoolValidatorChain('isMovable'),
];

export const validateEquipmentPut = [
  ...validateEquipmentPost,
  ...validateIdObl,
];

export const validateEquipmentMultiPost = [
  ...validateMultiNameObl,
  ...createMultiBoolValidatorChain('*.isMovable'),
  ...createMultiNumberValidatorChain('*.Priority'),
  ...validateMultiDescription,
];
