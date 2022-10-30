const express = require("express");
const subject = require("./subject");
const program = require("./program");
const allocation = require("./allocation");

const routes = express.Router();

routes.use("/subject", subject);
routes.use("/program", program);
routes.use("/allocation", allocation);

module.exports = routes;
