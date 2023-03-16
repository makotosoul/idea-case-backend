import { MysqlError } from 'mysql';
import logger from '../utils/logger.js';
import { Request, Response } from 'express';

const serverErrorMessage = "Server error.";
const requestErrorMessage = "Request error";
const dbErrorMessage = serverErrorMessage;
const successMessage = "OK";
const validationErrorMessage = "Formatting error";

export const dbErrorHandler = (res: Response, error: MysqlError, message: string):void => {
  if (!message) {
    message = dbErrorMessage;
  }
  message += `. Db error code: ${error.errno}`;
  message += `. Db error message: ${error.message}`;
  logger.error(message);

  res.status(500).send(dbErrorMessage);
};

export const successHandler = (res: Response, data: string, message: string) => {
  if (!message) {
    message = successMessage;
  }
  logger.http(message);
  
  /* if(typeof(data)==="number") {
    data = {returnedNumberValue:data}   // If data is just a number, wrapping an object around it
  } */

  res.status(200).send(data);
};

export const requestErrorHandler = (res: Response, message: string) => {
  if (!message) {
    message = requestErrorMessage;
  }
  logger.error(message);

  res.status(400).send(requestErrorMessage);
};

export const validationErrorHandler = (res: Response, message: string) => {
  if (!message) {
    message = validationErrorMessage;
  }
  logger.error(message);
  
  res.status(400).send(validationErrorMessage);
};