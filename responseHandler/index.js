const logger = require("../utils/logger");

const serverErrorMessage = "Server error.";
const requestErrorMessage = "Request error";
const dbErrorMessage = serverErrorMessage;
const successMessage = "OK";
const validationErrorMessage = "Formatting erroR";

const dbErrorHandler = (res, error, message) => {
  if (!message) {
    message = dbErrorMessage;
  }
  message += ` Db error code: ${error.errno}`;
  message += ` Db error message: ${error.message}`;
  logger.error(message);
  res.status(500).send(dbErrorMessage);
};

const successHandler = (res, data, message) => {
  if (!message) {
    message = successMessage;
  }
  logger.http(message);
  //logger.http("data: " +data);
  res.status(200).send(data);
};

const requestErrorHandler = (res, message) => {
  if (!message) {
    message = requestErrorMessage;
  }
  logger.error(message);
  res.status(400).send(requestErrorMessage);
};

const validationErrorHandler = (res, message) => {
  if (!message) {
    message = validationErrorMessage;
  }
  logger.error(message);
  res.status(400).send(validationErrorMessage);
};

module.exports = {
  dbErrorHandler,
  successHandler,
  requestErrorHandler,
  validationErrorHandler,
};
