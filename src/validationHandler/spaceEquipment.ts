import { check } from 'express-validator';
import { createIdValidatorChain } from './index.js';

/* ---- SPACEEQUIPMENT ---- */
export const validateSpaceId = [...createIdValidatorChain('spaceId')];
