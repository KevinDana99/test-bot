import { Router } from 'express'
import { z } from 'zod'

import { scrapingService } from '../../../v2/services/ScrapingService/index.js'

const trackRoute = Router()

const trackParamsSchema = z.object({
  id: z.string().trim().min(1)
})

const trackQuerySchema = z.object({
  url: z.string().trim().url().optional()
})

trackRoute.get('/:id', async (req, res) => {
  try {
    const params = trackParamsSchema.parse(req.params)
    const query = trackQuerySchema.parse(req.query)
    const result = await scrapingService.getTrackById(params.id, query.url)

    res.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to get track'
    const status = error instanceof z.ZodError ? 400 : 500

    res.status(status).json({
      error: status === 400 ? 'Invalid track request' : 'Failed to get track',
      message
    })
  }
})

export { trackRoute }
