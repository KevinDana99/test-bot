import { Router } from 'express'
import { z } from 'zod'

import { scrapingService } from '../../../v2/services/ScrapingService/index.js'

const previewRoute = Router()

const previewParamsSchema = z.object({
  id: z.string().trim().min(1)
})

previewRoute.get('/:id', async (req, res) => {
  try {
    const params = previewParamsSchema.parse(req.params)
    await scrapingService.streamPreview(params.id, res)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Preview failed'
    const status = error instanceof z.ZodError ? 400 : 500

    if (!res.headersSent) {
      res.status(status).json({
        error: status === 400 ? 'Invalid preview request' : 'Preview failed',
        message
      })
    }
  }
})

export { previewRoute }
