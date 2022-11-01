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

module.exports = {
  getAll,
};
