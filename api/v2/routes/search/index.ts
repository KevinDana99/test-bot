import { Router } from 'express'
import { z } from 'zod'

import { scrapingService } from '../../../v2/services/ScrapingService/index.js'

const searchRoute = Router()

const searchQuerySchema = z.object({
  q: z.string().trim().min(1)
})

searchRoute.get('/', async (req, res) => {
  try {
    const query = searchQuerySchema.parse(req.query)
    const result = await scrapingService.searchTracks(query.q)

    res.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed'
    const status = error instanceof z.ZodError ? 400 : 500

    res.status(status).json({
      error: status === 400 ? 'Invalid query params' : 'Search failed',
      message
    })
  }
})

export { searchRoute }
