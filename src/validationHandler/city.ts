import {
    createAverageTempValidator,
  createCityNameValidatorChain,
  createDateValidator,
  validateIdObl,
} from './index.js';

export const validateCityPost = [
  ...createCityNameValidatorChain('name'),
  ...createDateValidator('established'),
  ...createAverageTempValidator('averageTemp'),
];

// See how the PUT is usually just POST + id that exists for PUT already
export const validateSubjectPut = [...validateIdObl, ...validateCityPost];

