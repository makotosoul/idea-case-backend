import db from '../db/index.js';
import { Program } from '../types/custom.js';

const getAll = (): Promise<Program[]> => {
  const sqlQuery = 'SELECT p.id, p.name FROM Program p;';
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getById = (id: number) => {
  const sqlQuery = 'SELECT p.id, p.name FROM Program p WHERE p.id=?;';
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export default {
  getAll,
  getById,
};
