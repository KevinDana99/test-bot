import { Router } from 'express'
import { z } from 'zod'

import { scrapingService } from '../../../v2/services/ScrapingService/index.js'

const tracksRoute = Router()

const tracksQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  artist: z.string().trim().optional(),
  label: z.string().trim().optional(),
  year: z.string().trim().optional(),
  genre: z.string().trim().optional()
})

tracksRoute.get('/', async (req, res) => {
  try {
    const query = tracksQuerySchema.parse(req.query)
    const result = await scrapingService.getTracks(query)

    res.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to get tracks'
    const status = error instanceof z.ZodError ? 400 : 500

    res.status(status).json({
      error: status === 400 ? 'Invalid tracks request' : 'Failed to get tracks',
      message
    })
  }
})

export { tracksRoute }
