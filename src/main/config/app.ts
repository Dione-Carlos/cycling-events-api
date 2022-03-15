import express from 'express'
import configRoutes from './routes'
import configMiddlewares from './middlewares'

const app = express()

configMiddlewares(app)

configRoutes(app)

export default app
