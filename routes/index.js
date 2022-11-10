const express = require("express");
const subject = require("./subject");
const program = require("./program");
const equipment = require("./equipment");
const subjectequipment = require("./subjectEquipment");
const allocation = require("./allocation");
const spaceType = require("./spaceType");

const routes = express.Router();

routes.use("/subject", subject);
routes.use("/program", program);
routes.use("/spaceType", spaceType);
routes.use("/equipment", equipment);
routes.use("/subjectequipment", subjectequipment);
routes.use("/allocation", allocation);

module.exports = routes;
