const { body, validationResult, check } = require("express-validator");

let validateAddUpdateSubject = [
  check("name")
    .isLength({ min: 2, max: 255 })
    .withMessage("Must be between 2-255 characters long")
    .bail()
    .matches(/[A-Za-zäöåÄÖÅ0-9-\s]*$/) // /^[A-Z/i]+[a-z\u00c0-\u017e_ ]{2,255}$/)
    .withMessage("Must contain only letters")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  check("groupSize")
    .matches(/^[0-9]+$/)
    .withMessage("Must be a number")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  check("groupCount")
    .matches(/^[0-9]+$/)
    .withMessage("Must be a number")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  check("sessionLength")
    // .matches(/^(?:\d|[01]\d|2[0-3]):[0-5]\d$/)
    .matches(/^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/)
    .withMessage("Accepted format: 00:00:00")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  check("area")
    .matches(/^[0-9]*(.[0-9]{1,2})?$/)
    .withMessage("Must be a number")
    .bail()
    .isFloat()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  check("programId").notEmpty().withMessage("Cannot be empty").bail(),
  check("spaceTypeId").notEmpty().withMessage("Cannot be empty").bail(),
];
module.exports = { validateAddUpdateSubject };
