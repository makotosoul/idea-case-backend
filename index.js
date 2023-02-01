import routes from './routes/index.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
//import db from './db/index';???
//import logger from './utils/logger.js';???
import dotenv from 'dotenv';

dotenv.config({});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes);

app.listen(process.env.BE_SERVER_PORT, () => {
  console.log(`Running on port ${process.env.BE_SERVER_PORT}`);
});
