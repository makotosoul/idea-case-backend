/*
  ---- EXPRESS VALIDATOR ----
  Express-validator is a library that can be used to validate the data coming from 
  the frontend or other client
  https://express-validator.github.io/docs/
*/

import { check } from 'express-validator'; //import { body, validationResult,} ???

/* ---- SUBJECT ---- */
export const validateAddUpdateSubject = [
  check('name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Must be between 2-255 characters long')
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
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
    .matches(/^([0-1][0-2]):([0-5][0-9])(:[0-5][0-9])?$/)
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

/* ---- SUBJECTEQUIPMENT ---- */
export const validateAddUpdateSubjectEquipment = [
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
    .isFloat({ min: 50, max: 900 })
    .withMessage('Must be between 50 - 900')
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('obligatory').matches(/^[01]$/).withMessage('Must be 0 or 1').bail(),
];

export const validateAddEquipment = [
  check('name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Must be between 2-255 characters long')
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters')
    .bail(),
  check('priority').matches(/^[0-9]+$/).withMessage('Must be a number').bail(),
  check('description')
    .isLength({ min: 2, max: 255 })
    .withMessage('Must be between 2-255 characters long')
    .bail(),
  check('isMovable')
    .matches(/^[01]$/)
    .withMessage('isMovable needs to be 1 = can be moved, 0 = cannot be moved.')
    .bail(),
];

/* ---- BUILDING ---- */
export const validateAddUpdateBuilding = [
  check('name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Must be between 2-255 characters long')
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters, numbers and -')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('description')
    .isLength({ max: 16000 })
    .withMessage('Must be at maximum 16000 characters long')
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters, numbers and -')
    .bail(),
];

export const validateAddSetting = [
  check('name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Must be between 2-255 characters long')
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters, numbers and -')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
  check('description')
    .isLength({ max: 16000 })
    .withMessage('Must be at maximum 16000 characters long')
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters, numbers and -')
    .bail(),
];
