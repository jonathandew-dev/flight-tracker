import winston, { format, transports } from "winston";
import type { TransformableInfo } from "logform"; // <- Import the correct type

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf((info: TransformableInfo) => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp(),
    logFormat
  ),
  transports: [new transports.Console()],
});
