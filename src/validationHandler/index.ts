import { NextFunction, Request, Response } from 'express';
/*
  ---- EXPRESS VALIDATOR ----
  Express-validator is a library that can be used to validate the data
  coming from the frontend or other client
  https://express-validator.github.io/docs/
*/
import {
  Result,
  ValidationChain,
  ValidationError,
  body,
  check,
  validationResult,
} from 'express-validator'; // import { body, validationResult } ???

import { validationErrorHandler } from '../responseHandler/index.js';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const validationResults: Result<ValidationError> = validationResult(req);

  if (!validationResults.isEmpty()) {
    validationErrorHandler(req, res, 'Validation', validationResults);
    return;
  } else {
    next();
  }
};

// Common validator chain objects for: id, name, description, priority
export const createIdValidatorChain = (
  fieldName: string,
): ValidationChain[] => [
  check(`${fieldName}`)
    .matches(/^[0-9]+$/)
    .withMessage(`${fieldName} must be a number`)
    .bail()
    .notEmpty()
    .withMessage(`${fieldName} cannot be empty`)
    .bail(),
];

export const createNameValidatorChain = (
  fieldName: string,
): ValidationChain[] => [
  check(`${fieldName}`)
    .isLength({ min: 2, max: 255 })
    .withMessage(`${fieldName} must be between 2-255 characters long`)
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage(`${fieldName} must contain only letters, numbers and -`)
    .bail()
    .notEmpty()
    .withMessage(`${fieldName} cannot be empty`)
    .bail(),
];

export const createDescriptionValidatorChain = (
  fieldName: string,
): ValidationChain[] => [
  check(`${fieldName}`)
    .isLength({ max: 16000 })
    .withMessage(`${fieldName} can be at maximum 16000 characters long`)
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage(`${fieldName} must contain only letters, numbers and -`)
    .bail()
    .notEmpty()
    .withMessage(`${fieldName} cannot be empty`)
    .bail(),
];

export const validatePriorityMustBeNumber = [
  check('priority')
    .matches(/^[0-9]+$/)
    .withMessage('Priority must be a number')
    .bail(),
];

export const createMultiNameValidatorChain = (
  fieldName: string,
): ValidationChain[] => [
  body(`*.${fieldName}`)
    .isLength({ min: 2, max: 255 })
    .withMessage(`${fieldName} must be between 2-255 characters long`)
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage(`${fieldName} must contain only letters, numbers and -`)
    .bail()
    .notEmpty()
    .withMessage(`${fieldName} cannot be empty`)
    .bail(),
];

export const createMultiDescriptionValidatorChain = (
  fieldName: string,
): ValidationChain[] => [
  body(`*.${fieldName}`)
    .isLength({ max: 16000 })
    .withMessage(`${fieldName} can be at maximum 16000 characters long`)
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage(`${fieldName} must contain only letters, numbers and -`)
    .bail(),
];

export const createMultiTimeValidatorChain = (
  fieldName: string,
): ValidationChain[] => [
  body(`*.${fieldName}`)
    .matches(/^([0-1][0-9]):([0-5][0-9])(:[0-5][0-9])?$/)
    .withMessage('Accepted format: 00:00 or 00:00:00')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
];

export const validateIdObl = [...createIdValidatorChain('id')];
export const validateNameObl = [...createNameValidatorChain('name')];
export const validateDescriptionObl = [
  ...createDescriptionValidatorChain('description'),
];
export const validateMultiNameObl = [...createMultiNameValidatorChain('name')];
export const validateMultiDescription = [
  ...createMultiDescriptionValidatorChain('description'),
];
