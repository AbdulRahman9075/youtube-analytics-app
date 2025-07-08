import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green'
});

const logger = winston.createLogger({
  level: 'info', // logs 'info' and everything more severe
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // include stack trace
    winston.format.colorize({ level: true }),
    winston.format.printf(({ timestamp, level, message, stack }) =>
      `[${timestamp}] ${level.toUpperCase()}: ${message}${stack ? '\n' + stack : ''}`
    )
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log') }),
    new winston.transports.Console()
  ]
});

export default logger;

export const sendError = (res, status = 500, message = "Internal Server Error", code = "INTERNAL_ERROR") => {
  logger.error(`(${code}) ${message}`);
  return res.status(status).json({
    success: false,
    error: {
      message,
      code
    }
  });
};
