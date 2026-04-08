import { Router } from 'express'
import { z } from 'zod'

import { scrapingService } from '../../../v2/services/ScrapingService/index.js'

const downloadRoute = Router()

const downloadParamsSchema = z.object({
  id: z.string().trim().min(1)
})

const downloadQuerySchema = z.object({
  title: z.string().trim().optional(),
  artist: z.string().trim().optional(),
  mix: z.string().trim().optional()
})

downloadRoute.get('/:id', async (req, res) => {
  try {
    const params = downloadParamsSchema.parse(req.params)
    const query = downloadQuerySchema.parse(req.query)

    await scrapingService.downloadTrack(params.id, query, res)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Download failed'
    const status = error instanceof z.ZodError ? 400 : 500

    if (!res.headersSent) {
      res.status(status).json({
        error: status === 400 ? 'Invalid download request' : 'Download failed',
        message
      })
    }
  }
})

export { downloadRoute }
