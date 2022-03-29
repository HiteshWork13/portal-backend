import { get } from 'express-http-context';
import winston from './winston';
const winstonLogger = new winston().initLogger();

class loggerClass {

  formatMessage(message) {
    var email = get('email');
    message = email ? message + ' email: ' + email : message;
    return message;
  }

  private ERROR = 'error';
  private WARN = 'warn';
  private INFO = 'info';
  private VERBOSE = 'verbose';
  private DEBUG = 'debug';
  private SILLY = 'silly';

  public logger = {
    log: (log_level, message) => {
      switch (log_level) {
        case log_level:
          winstonLogger.log({
            level: log_level,
            message: this.formatMessage(message)
          });
          break;
        default:
          winstonLogger.log({
            level: this.INFO,
            message: this.formatMessage(message)
          });
          break;
      }
    }
  };

  public level = {
    error: this.ERROR,
    warn: this.WARN,
    info: this.INFO,
    verbose: this.VERBOSE,
    debug: this.DEBUG,
    silly: this.SILLY
  };

}

const instance = new loggerClass();
export const logger = instance.logger;
export const level = instance.level;