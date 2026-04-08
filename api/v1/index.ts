import express from 'express'
import rootRoute from './routes/root'
import downloadRoute from './routes/download'
import searchRoute from './routes/search'
const v1Router = express.Router()

v1Router.use('/', rootRoute)
v1Router.use('/music/search', searchRoute)
v1Router.use('/music/download', downloadRoute)

export { v1Router }
