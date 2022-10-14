const express = require("express");
const subject = require("./subject");
const program = require("./program");

const routes = express.Router();

routes.use("/subject", subject);
routes.use("/program", program);

module.exports = routes;
