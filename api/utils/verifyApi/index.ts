import { ApiVersionsType } from '@/api/types'
import config from '@/config'

const verifyApi = async (version: ApiVersionsType) => {
  try {
    const req = await fetch(`${config.API_HOST}/api/${version}`)
    const res = await req.json()
    console.log(` ✅ Api ${version} working in port: ${config.PORT}`)
    return res
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message)
      throw Error(err.message)
    }
  }
}

export { verifyApi }
