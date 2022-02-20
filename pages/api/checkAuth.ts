import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  res.status(200).json({
    auth: (!!cookies['access-token'] || !!cookies['refresh-token'])
  })
}