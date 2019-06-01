import * as config from 'config';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, align, colorize, printf } = format;

export default createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp(),
    align(),
    printf((info) => {
      if (!info) return '';
      const { level, message, stack } = info;
      const args = { ...info };
      delete args.timestamp;
      delete args.level;
      delete args.message;

      const string = (stack && stack.replace('Error:', '')) || message;

      const ts = info.timestamp.slice(0, 19).replace('T', ' ');
      try {
        let message = '';
        switch (typeof args) {
          case 'undefined':
            break;
          case 'object':
            if (Object.keys(args).length){
              message = JSON.stringify(args, null, 2);
            }
            break;
          case 'string':
            message = args.message;
            break;
            case 'boolean' || 'symbol' || 'bigint' || 'number':
              break;
          case 'function':
            break;
          default: message = '';
        }
        return `${ts} [${level}]: ${string.trim()} ${message}`;
      } catch (err) {
        console.error(args);
      }
    }),
  ),
  transports: [
    new transports.Console({ level: 'error', format: colorize() }),
    new transports.File({ filename: config.get('web.logFile'), format: colorize() }),
  ],
});
