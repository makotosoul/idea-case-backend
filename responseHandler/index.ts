import logger from '../utils/logger.js';

const serverErrorMessage = "Server error.";
const requestErrorMessage = "Request error";
const dbErrorMessage = serverErrorMessage;
const successMessage = "OK";
const validationErrorMessage = "Formatting error";

export const dbErrorHandler = (res: Response, error: Error , message: string):void => {
  if (!message) {
    message = dbErrorMessage;
  }
  message += `. Db error code: ${error.errno}`;
  message += `. Db error message: ${error.message}`;
  logger.error(message);

  res.status(500).send(dbErrorMessage);
};

export const successHandler = (res, data, message) => {
  if (!message) {
    message = successMessage;
  }
  logger.http(message);
  
  if(typeof(data)==="number") {
    data = {returnedNumberValue:data}   // If data is just a number, wrapping an object around it
  }

  res.status(200).send(data);
};

export const requestErrorHandler = (res, message) => {
  if (!message) {
    message = requestErrorMessage;
  }
  logger.error(message);

  res.status(400).send(requestErrorMessage);
};

export const validationErrorHandler = (res, message) => {
  if (!message) {
    message = validationErrorMessage;
  }
  logger.error(message);
  
  res.status(400).send(validationErrorMessage);
};