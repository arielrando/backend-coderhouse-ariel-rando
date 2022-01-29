const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    fileWar: { type: 'file', filename: 'warnings.log' },
    fileErr: { type: 'file', filename: 'errors.log' },
    loggerConsole: {
      type: 'logLevelFilter',
      appender: 'console',
      level: 'info',
    },
    loggerWarnings: {
      type: 'logLevelFilter',
      appender: 'fileWar',
      level: 'warn',
    },
    loggerErrors: {
      type: 'logLevelFilter',
      appender: 'fileErr',
      level: 'error',
    },
  },
  categories: {
    default: {
      appenders: ['loggerConsole','loggerWarnings', 'loggerErrors'],
      level: 'all',
    }
  },
})

const logger = log4js.getLogger();

module.exports = logger;