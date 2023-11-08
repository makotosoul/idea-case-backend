import { createIdValidatorChain } from './index.js';

export const validateSpaceTypeId = [...createIdValidatorChain('spaceTypeId')];
