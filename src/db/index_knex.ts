import dotenv from 'dotenv';

// Work around the incompatibility between Knex typings
// and the "module": "nodenext" TS config
// Will be fixed once a new version of Knex with the following PR is released:
// https://github.com/knex/knex/pull/5659
import * as knexModule from 'knex';
const { knex } = knexModule.default;

dotenv.config({});

const databaseConfigObject = {
  client: process.env.DB_DRIVER_MODULE || 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    debug: process.env.DB_DEBUG,
    multipleStatements: true,
  },
  pool: {
    min: Number(process.env.DB_CONNECTION_POOL_MIN) || 0,
    max: Number(process.env.DB_CONNECTION_POOL_MAX) || 7,
  },
};

// initiate knex with config
export default knex(databaseConfigObject);
