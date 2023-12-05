import { validateBuildingId } from './building.js';
import {
  createBoolValidatorChain,
  createFloatValidatorChain,
  createIdValidatorChain,
  createMultiDescriptionValidatorChain,
  createMultiFloatValidatorChain,
  createMultiNameValidatorChain,
  createMultiNumberValidatorChain,
  createMultiTimeValidatorChain,
  validateIdObl,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';
import { validateSpaceTypeId } from './spaceType.js';

export const validateSpaceId = [...createIdValidatorChain('spaceId')];

export const validateMultiSpaceInfo = [
  ...createMultiDescriptionValidatorChain('info'),
];

export const validateSpacePost = [
  ...validateNameObl,
  ...createFloatValidatorChain('area'),
  ...validateBuildingId,
  ...validateSpaceTypeId,
  // Add more validation rules for other space properties
];

export const validateSpacePut = [...validateIdObl, ...validateSpacePost];
export const validateMultiSpacePost = [
  ...validateMultiNameObl,
  ...createMultiFloatValidatorChain('*.area'),
  ...validateMultiSpaceInfo,
  ...createMultiNumberValidatorChain('*.personLimit'),
  ...createMultiNameValidatorChain('buildingName'),
  ...createMultiTimeValidatorChain('availableFrom'),
  ...createMultiTimeValidatorChain('availableTo'),
  ...createMultiTimeValidatorChain('classesFrom'),
  ...createMultiTimeValidatorChain('classesTo'),
  ...createBoolValidatorChain('inUse'),
  ...createMultiNameValidatorChain('spaceType'),
];
