import routes from './routes/index.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from './utils/logger.js';
import dotenv from 'dotenv';
import verifyJwtAndCheckExpiration from './middlewares/jwtAging.js';

const app = express();

dotenv.config({});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(verifyJwtAndCheckExpiration);
app.use('/api', routes);

app.listen(process.env.BE_SERVER_PORT, () => {
  logger.log('info', `Backend starting on port ${process.env.BE_SERVER_PORT}`);
});
