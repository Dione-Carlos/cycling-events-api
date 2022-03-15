export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/cycling-events-db',
  port: process.env.PORT ?? 5050
}
