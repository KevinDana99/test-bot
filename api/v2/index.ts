import { Router } from 'express'

import { downloadRoute } from './routes/download/index.js'
import { previewRoute } from './routes/preview/index.js'
import { rootRoute } from './routes/root/index.js'
import { searchRoute } from './routes/search/index.js'
import { trackRoute } from './routes/track/index.js'
import { tracksRoute } from './routes/tracks/index.js'

const v2Router = Router()

v2Router.use('/', rootRoute)
v2Router.use('/search', searchRoute)
v2Router.use('/track', trackRoute)
v2Router.use('/download', downloadRoute)
v2Router.use('/tracks', tracksRoute)
v2Router.use('/preview', previewRoute)

export { v2Router }
