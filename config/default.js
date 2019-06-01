module.exports = {
  web: {
    hostPrefix: 'http://',
    host: 'localhost',
    port: 4000,
    logFile: 'web.log'
  },
  secret: '3!3Dx!JhvoiMECX@!o&0ggIASnxR',
  expiresIn: '24h',
  crypto: {
    hash: {
      length: 128,
      // may be slow(!): iterations = 12000 take ~60ms to generate strong password
      iterations: process.env.NODE_ENV === 'dev' ? 1 : 12000
    }
  },
  postgres: {
    host: 'localhost',
    dialect: 'postgres',
    port: 6543,
    pool: {
      max: 20,
      min: 0,
      idle: 10000
    },
    username: 'importer',
    password: 'postgres',
    base: 'postgres',
    database: 'postgres',
    logging: false
  },
  postgresSchema: 'public',
};
