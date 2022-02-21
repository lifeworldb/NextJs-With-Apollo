import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

type Data = {
  auth: boolean
}

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  res.status(200).json({
    auth: (!!cookies['access-token'] || !!cookies['refresh-token'])
  })
}