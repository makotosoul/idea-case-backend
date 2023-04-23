import { MysqlError } from 'mysql';
import logger from '../utils/logger.js';
import { Response, Request } from 'express';

const serverErrorMessage = 'Server error.';
const requestErrorMessage = 'Request error';
const dbErrorMessage = serverErrorMessage;
const successMessage = 'OK';
const validationErrorMessage = 'Formatting error';

export const routePrinter = (req: Request): string => {
  let routeText = req.baseUrl;
  return routeText;
};

export const dbErrorHandler = (
  req: Request,
  res: Response,
  error: MysqlError,
  message: string,
): void => {
  let logMessage = routePrinter(req);

  if (!message) {
    logMessage += dbErrorMessage;
  } else {
    logMessage += message;
  }
  logMessage += `. Db error code: ${error.errno}`;
  logMessage += `. Db error message: ${error.message}`;
  logger.error(logMessage);

  res.status(500).send(dbErrorMessage);
};

export const successHandler = (
  req: Request,
  res: Response,
  data: any,
  message: string,
) => {
  let logMessage = routePrinter(req);
  if (!message) {
    logMessage += successMessage;
  } else {
    logMessage += message;
  }

  logger.http(logMessage);

  if (typeof data === 'number') {
    data = { returnedNumberValue: data }; // If data is just a number, wrapping an object around it
    console.log(data);
  }

  res.status(200).send(data);
};

export const requestErrorHandler = (
  req: Request,
  res: Response,
  message: string,
) => {
  let logMessage = routePrinter(req);
  if (!message) {
    logMessage += requestErrorMessage;
  } else {
    logMessage += message;
  }
  logger.error(logMessage);

  res.status(400).send(requestErrorMessage);
};

export const validationErrorHandler = (
  req: Request,
  res: Response,
  message: string,
) => {
  let logMessage = routePrinter(req);
  if (!message) {
    logMessage = validationErrorMessage;
  } else {
    logMessage += message;
  }

  logger.error(message);

  res.status(400).send(validationErrorMessage);
};
