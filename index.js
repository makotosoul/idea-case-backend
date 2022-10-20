const routes = require("./routes/index.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./db/index");
const logger = require("./utils/logger");
const dotenv = require("dotenv");

dotenv.config({});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes);

app.listen(process.env.BE_SERVER_PORT, () => {
  console.log(`Running on port ${process.env.BE_SERVER_PORT}`);
});
