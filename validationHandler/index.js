/*
  ---- EXPRESS VALIDATOR ----
  Express - validator on kirjasto jolla voidaan validoida fontista tulevaa dataa
  https://express-validator.github.io/docs/
*/

const {check } = require("express-validator");//const { body, validationResult,} ???

/* ---- SUBJECT ---- */
let validateAddUpdateSubject = [
  check("name")
    .isLength({ min: 2, max: 255 })
    .withMessage("Must be between 2-255 characters long")
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
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
    .matches(/^([0-1][0-2]):([0-5][0-9])(:[0-5][0-9])?$/)
    .withMessage("Accepted format: 00:00 or 00:00:00")
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
];

/* ---- SUBJECTEQUIPMENT ---- */
let validateAddUpdateSubjectEquipment = [
  check("subjectId")
    .matches(/^[0-9]+$/)
    .withMessage("Must be a number")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  check("equipmentId")
    .matches(/^[0-9]+$/)
    .withMessage("Must be a number")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  check("priority")
    .matches(/^[0-9]+$/)
    .withMessage("Must be a number")
    .bail()
    .isFloat({ min: 50, max: 900 })
    .withMessage("Must be between 50 - 900")
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  check("obligatory").matches(/^[01]$/).withMessage("Must be 0 or 1").bail(),
];
module.exports = {
  validateAddUpdateSubject,
  validateAddUpdateSubjectEquipment,
};
