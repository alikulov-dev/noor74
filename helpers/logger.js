const { createLogger, format, transports, config } = require('winston');
const { combine, timestamp, json } = format;
// require('../logs/server.log')
const userLogger = createLogger({
  levels: config.syslog.levels,
  transports: [
      // new transports.Console(),
      new transports.File({ filename: './logs/server.log' })
    ]
});
const paymentLogger = createLogger({
  transports: [
      new transports.Console()
    ]
});

module.exports = {
userLogger: userLogger,
paymentLogger: paymentLogger
};