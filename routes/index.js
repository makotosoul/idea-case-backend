const express = require("express");
const subject = require("./subject");
const program = require("./program");
const allocation = require("./allocation");
const spaceType = require("./spaceType");

const routes = express.Router();

routes.use("/subject", subject);
routes.use("/program", program);
routes.use("/spaceType", spaceType);
routes.use("/allocation", allocation);

module.exports = routes;
