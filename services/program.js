const db = require("../db/index");

const getAll = () => {
  const sqlQuery = "SELECT p.id, p.name FROM Program p;";
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

const getById = (id) => {
  const sqlQuery = "SELECT p.id, p.name FROM Program p WHERE p.id=?;";
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, id, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getAll,
  getById,
};
