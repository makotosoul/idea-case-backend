import { check } from 'express-validator';
import { validateIdObl, validateNameObl } from './index.js';

/* ---- SUBJECT ---- */
export const validateSubjectPost = [
  ...validateNameObl,
  check('groupSize')
    .matches(/^[0-9]+$/)
    .withMessage('Must be a number')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('groupCount')
    .matches(/^[0-9]+$/)
    .withMessage('Must be a number')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('sessionLength')
    .matches(/^([0-1][0-9]):([0-5][0-9])(:[0-5][0-9])?$/)
    .withMessage('Accepted format: 00:00 or 00:00:00')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('area')
    .matches(/^[0-9]*(.[0-9]{1,2})?$/)
    .withMessage('Must be a number')
    .bail()
    .isFloat()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('programId').notEmpty().withMessage('Cannot be empty').bail(),
];

export const validateSubjectPut = [...validateIdObl, ...validateSubjectPost];
