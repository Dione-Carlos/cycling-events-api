export default {
  mongoUrl: process.env?.MONGO_URL || 'mongodb://mongo:27017/cycling-events-db',
  port: process.env?.PORT || 5050,
  jwtSecret: process.env?.JWT_SECRET || 'BX2zKUeRw2zrVJF'
}
