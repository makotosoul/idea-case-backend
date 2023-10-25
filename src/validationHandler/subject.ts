import { body, check } from 'express-validator';
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

export const validateSubjectMultiPost = [
  body('*.name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Must be between 2-255 characters long')
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters, numbers and -')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  body('*.groupSize')
    .matches(/^[0-9]+$/)
    .withMessage('Must be a number')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  body('*.groupCount')
    .matches(/^[0-9]+$/)
    .withMessage('Must be a number')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  body('*.sessionLength')
    .matches(/^([0-1][0-9]):([0-5][0-9])(:[0-5][0-9])?$/)
    .withMessage('Accepted format: 00:00 or 00:00:00')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  body('*.area')
    .matches(/^[0-9]*(.[0-9]{1,2})?$/)
    .withMessage('Must be a number')
    .bail()
    .isFloat()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
];

export const validateSubjectPut = [...validateIdObl, ...validateSubjectPost];
