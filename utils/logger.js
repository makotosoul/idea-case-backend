const { createLogger, transports, format } = require("winston");
const LEVEL = Symbol.for("level");

const customFormat = format.combine(
  format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  format.splat(),
  format.printf((info) => {
    return `${
      info.timestamp
    } - [${info.level.toLocaleUpperCase()}] - ${info.message}`;
  }),
);

function filterOnly(level) {
  return format(function (info, http) {
    if (info[LEVEL] === level) {
      return info;
    }
    if (http[LEVEL] === level) {
      return http;
    }
  })();
}

const logger = createLogger({
  format: customFormat,
  transports: [
    new transports.Console({ level: "silly" }),
    new transports.File({
      filename: "./utils/app.log",
      level: "info",
      format: filterOnly("info"),
    }),
    new transports.File({ filename: "./utils/error.log", level: "error" }),
    new transports.File({
      filename: "./utils/http.log",
      level: "http",
      format: filterOnly("http"),
    }),
  ],
});

module.exports = logger;
