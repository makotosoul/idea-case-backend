import { check } from 'express-validator';
import { createIdValidatorChain } from './index.js';

/* ---- SPACEEQUIPMENT ---- */
export const validateSpaceId = [...createIdValidatorChain('spaceId')];

export const validateSpaceEquipmentPost = [
  ...validateSpaceId,
  check('equipmentId')
    .matches(/^[0-9]+$/)
    .withMessage('Must be a number')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
];
