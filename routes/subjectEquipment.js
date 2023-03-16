import express from 'express';
import db from '../db/index.js';
import logger from '../utils/logger.js';
import {
  dbErrorHandler,
  successHandler,
  requestErrorHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';
import { validationResult } from 'express-validator';// import { body,} ??
import {
  validateAddUpdateSubjectEquipment,
} from '../validationHandler/index.js';

const subjectequipment = express.Router();

// Getting all equipment requirement rows for a subject based on the subject id
subjectequipment.get("/getEquipment/:subjectId", (req, res) => {
  const subjectId = req.params.subjectId;
  const sqlGetEquipmentBySubjectId =
    "SELECT se.subjectId , e.name,e.description, se.equipmentId, se.priority, se.obligatory FROM SubjectEquipment se JOIN Equipment e ON se.equipmentId = e.id WHERE se.subjectid = ?;";
  db.query(sqlGetEquipmentBySubjectId, subjectId, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - SubjectEquipment");
    } else {
      successHandler(res, result, "getEquipment successful - SubjectEquipment");
    }
  });
});

// Adding a equipment requirement to teaching/subject
subjectequipment.post(
  "/post",
  validateAddUpdateSubjectEquipment,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Validation error:  %O", errors);
    }
    if (!errors.isEmpty()) {
      return validationErrorHandler(res, "Formatting problem");
    }
    const subjectId = req.body.subjectId;
    const equipmentId = req.body.equipmentId;
    const priority = req.body.priority;
    const obligatory = req.body.obligatory;
    const sqlInsert =
      "INSERT INTO SubjectEquipment (subjectId, equipmentId, priority, obligatory) VALUES (?,?,?,?)";
    db.query(
      sqlInsert,
      [subjectId, equipmentId, priority, obligatory],
      (err, result) => {
        if (!result) {
          requestErrorHandler(res, err + ": Nothing to insert");
        } else if (err) {
          dbErrorHandler(res, err, "Oops! Create failed - SubjectEquipment");
        } else {
          successHandler(
            res,
            { insertId: result.insertId },
            "Create successful - SubjectEquipment",
          );
          logger.info(
            `SubjectEquipment created subjectId ${req.body.subjectId} &
              ${req.body.equipmentId}`,
          );
        }
      },
    );
  },
);

// Removing an equipment requirement from a subject
subjectequipment.delete("/delete/:subjectId/:equipmentId", (req, res) => {
  const subjectId = req.params.subjectId;
  const equipmentId = req.params.equipmentId;
  const sqlDelete =
    "DELETE FROM SubjectEquipment WHERE subjectId = ? AND equipmentId = ?;";
  db.query(sqlDelete, [subjectId, equipmentId], (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Delete failed - SubjectEquipment");
    } else {
      successHandler(res, result, "Delete successful - SubjectEquipment");
      logger.info("SubjectEquipment deleted");
    }
  });
});

// Modifying the equipment required by the subject/teaching
subjectequipment.put(
  "/update",
  validateAddUpdateSubjectEquipment,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Validation error: %0", errors);
    }
    if (!errors.isEmpty()) {
      return validationErrorHandler(res, "Formatting problem");
    }
    const priority = req.body.priority;
    const obligatory = req.body.obligatory;
    const subjectId = req.body.subjectId;
    const equipmentId = req.body.equipmentId;
    const sqlUpdate =
      " UPDATE SubjectEquipment SET priority = ?, obligatory = ? WHERE subjectId = ? AND equipmentId = ?;";
    db.query(
      sqlUpdate,
      [priority, obligatory, subjectId, equipmentId],
      (err, result) => {
        if (!result) {
          requestErrorHandler(res, err + ": Nothing to update");
        } else if (err) {
          dbErrorHandler(res, err, "Oops! Update failed - SubjectEquipment");
        } else {
          successHandler(res, result, "Update successful - SubjectEquipment");
          logger.info("SubjectEquipment ", req.body.subjectId, " updated");
        }
      },
    );
  },
);

export default subjectequipment;
