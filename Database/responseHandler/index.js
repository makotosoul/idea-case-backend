const logger = require("../utils/logger");

const serverErrorMessage = "Server error.";
const requestErrorMessage = "Request error";
const dbErrorMessage = serverErrorMessage;
const succsessMessage = "OK";

const dbErrorHandler = (res, error, message) => {
  if (!message) {
    message = dbErrorMessage;
  }
  message += ` Db error code: ${error.errno}`;
  message += ` Db error message: ${error.message}`;
  logger.error(message);
  res.status(500).send(dbErrorMessage);
};

const succsessHandler = (res, data, message) => {
  if (!message) {
    message = succsessMessage;
  }
  logger.http(message);
  res.status(200).send(data);
};

const requestErrorHandler = (res, message) => {
  if (!message) {
    message = requestErrorMessage;
  }
  logger.error(message);
  res.status(400).send(requestErrorMessage);
};

module.exports = { dbErrorHandler, succsessHandler, requestErrorHandler };
