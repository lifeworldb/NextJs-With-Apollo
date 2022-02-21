import { NormalizedCacheObject } from '@apollo/client'
import { IncomingHttpHeaders } from 'http'
import { GetServerSidePropsContext } from 'next'

type InitialState = NormalizedCacheObject | undefined

export interface IInitializeApollo {
  ctx?: GetServerSidePropsContext | null
  headers?: IncomingHttpHeaders | null
  initialState?: InitialState | null
}
