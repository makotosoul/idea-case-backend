import { Request, Response } from 'express';
import { Result, ValidationError } from 'express-validator';
import { MysqlError } from 'mysql';
import logger from '../utils/logger.js';
import { validationErrorFormatter } from '../validationHandler/index.js';

const serverErrorMessage = 'Server error.';
const requestErrorMessage = 'Request error';
const dbErrorMessage = serverErrorMessage;
const successMessage = 'OK';
const authenticationErrorMessage = requestErrorMessage;
const authorizationErrorMessage = requestErrorMessage;
const validationErrorMessage = requestErrorMessage; // 'Formatting error';

export const routePrinter = (req: Request): string => {
  const routeText = `${req.method} ${req.baseUrl.substring(4)}|`;
  return routeText;
};

const messagePrinter = (
  providedMessage: string,
  defaultMessage: string,
): string => {
  return `${providedMessage ? providedMessage : defaultMessage}|`;
};

export const dbErrorHandler = (
  req: Request,
  res: Response,
  error: MysqlError,
  message: string,
): void => {
  let logMessage = routePrinter(req) + messagePrinter(message, dbErrorMessage);

  logMessage += `. Db error code: ${error.errno}`;
  logMessage += `. Db error message: ${error.message}`;
  logger.error(logMessage);

  res.status(500).send(dbErrorMessage);
};

export const successHandler = (
  req: Request,
  res: Response,
  data: unknown,
  message: string,
) => {
  const logMessage =
    routePrinter(req) + messagePrinter(message, successMessage);

  logger.http(logMessage);

  // If data is just a number, wrap an object around it
  const body = typeof data === 'number' ? { returnedNumberValue: data } : data;

  res.status(200).send(body);
};

export const requestErrorHandler = (
  req: Request,
  res: Response,
  message: string,
) => {
  const logMessage =
    routePrinter(req) + messagePrinter(message, requestErrorMessage);
  logger.error(logMessage);

  res.status(400).send(requestErrorMessage);
};

export const authenticationErrorHandler = (
  req: Request,
  res: Response,
  message: string,
) => {
  const logMessage =
    routePrinter(req) + messagePrinter(message, authenticationErrorMessage);
  logger.error(logMessage);

  res.status(401).send(authenticationErrorMessage);
};

export const authorizationErrorHandler = (
  req: Request,
  res: Response,
  message: string,
) => {
  const logMessage =
    routePrinter(req) + messagePrinter(message, authorizationErrorMessage);
  logger.error(logMessage);

  res.status(403).send(authorizationErrorMessage);
};

export const validationErrorHandler = (
  req: Request,
  res: Response,
  message: string,
  validationResults?: Result<ValidationError>,
) => {
  let validationResultMessage = '';
  if (validationResults !== undefined) {
    validationResultMessage += validationErrorFormatter(validationResults);
  }
  validationResultMessage += `|${message}`;
  const logMessage =
    routePrinter(req) +
    messagePrinter(validationResultMessage, validationErrorMessage);

  logger.error(logMessage);

  res.status(400).send(validationErrorMessage);
};
