import { Express } from 'express'

import { verifyApi } from './utils/verifyApi/index.js'
import { v2Router } from './v2/index.js'
import { v1Router } from './v1/index.js'

const router = (app: Express) => {
  app.use('/api/v1', v1Router)
  app.use('/api/v2', v2Router)
}

export default router
