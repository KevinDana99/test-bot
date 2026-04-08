import { Router } from 'express'

const rootRoute = Router()

rootRoute.get('/', (_req, res) => {
  res.json({
    name: 'hardstyle-scraper-backend',
    version: 'v2',
    status: 'ok',
    endpoints: [
      '/api/search',
      '/api/track/:id',
      '/api/download/:id',
      '/api/tracks',
      '/api/preview/:id'
    ]
  })
})

export { rootRoute }
