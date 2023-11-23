import { check } from 'express-validator';
import { validateEquipmentId } from './equipment.js';
import { validateSubjectId } from './subject.js';

/* ---- SUBJECTEQUIPMENT ---- */

export const validateSubjectEquipmentPost = [
  ...validateSubjectId,
  ...validateEquipmentId,
  check('priority')
    .matches(/^[0-9]+$/)
    .withMessage('Must be a number')
    .bail()
    .isFloat({ min: 30, max: 900 })
    .withMessage('Must be between 50 - 900')
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('obligatory')
    .matches(/^[01]$/)
    .withMessage('Must be 0 or 1')
    .bail(),
];
