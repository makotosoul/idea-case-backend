import { check } from 'express-validator';

/* ---- SUBJECTEQUIPMENT ---- */
export const validateSubjectEquipmentPostAndPut = [
  check('subjectId')
    .matches(/^[0-9]+$/)
    .withMessage('Must be a number')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('equipmentId')
    .matches(/^[0-9]+$/)
    .withMessage('Must be a number')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('priority')
    .matches(/^[0-9]+$/)
    .withMessage('Must be a number')
    .bail()
    .isFloat({ min: 30, max: 900 })
    .withMessage('Must be between 50 - 900')
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('obligatory').matches(/^[01]$/).withMessage('Must be 0 or 1').bail(),
];
