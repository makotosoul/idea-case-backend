const routes = require("./routes/index.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./db/index");
const logger = require("./utils/logger");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes);

app.listen(3001, () => {
  console.log("Running on port 3001");
});
