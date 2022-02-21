// Libs
import { useMemo } from 'react'
import { ApolloClient, HttpLink, createHttpLink, gql, InMemoryCache, NormalizedCacheObject, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { fromPromise } from '@apollo/client'
import { concatPagination } from '@apollo/client/utilities'
import { GetServerSidePropsContext } from 'next'
import { IInitializeApollo } from './apollo.types'
import fetch from 'isomorphic-unfetch'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'

let apolloClient: ApolloClient<NormalizedCacheObject>
let isRefreshing: boolean = false
let pendingRequests: Function[] = []

const REFRESH_AUTH_TOKEN = gql`
  mutation refreshToken {
    refreshToken {
      developerCode
      message
    }
  }
`

const getNewTokens = async (): Promise<unknown> =>
  // eslint-disable-next-line no-return-await
  await apolloClient.mutate({ mutation: REFRESH_AUTH_TOKEN }).then(res => {
    const { refreshToken } = res.data
    if (typeof window === 'undefined') apolloClient = undefined
    return refreshToken
  })

const resolvePendingRequests = (): void => {
  pendingRequests.map(callback => callback())
  pendingRequests = []
}

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      // eslint-disable-next-line consistent-return
      graphQLErrors.forEach(error => {
        // @ts-expect-error
        if (error.statusCode === 401) {
          // error code is set to UNAUTHENTICATED
          // when AuthenticationError thrown in resolver
          let forward$

          if (!isRefreshing) {
            isRefreshing = true
            forward$ = fromPromise(
              getNewTokens()
                .then(({ accessToken, refreshToken }) => {
                    console.log(refreshToken)
                    // Store the new tokens for your auth link
                    resolvePendingRequests()
                    return accessToken
                  })
                // eslint-disable-next-line no-shadow,node/handle-callback-err
                .catch(error => {
                  pendingRequests = []
                  // Handle token refresh errors e.g clear stored tokens, redirect to login, ...
                })
                .finally(() => {
                  isRefreshing = false
                })
            ).filter(value => Boolean(value))
          } else {
            // Will only emit once the Promise is resolved
            forward$ = fromPromise(
              new Promise<void>(resolve => {
                pendingRequests.push(() => resolve())
              })
            )
          }

          return forward$.flatMap(() => forward(operation))
        }
      })
    }
    if (networkError) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      console.log(`[Network error]: ${networkError}`)
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  }
)

const createApolloclient = (ctx: GetServerSidePropsContext | null = null): ApolloClient<NormalizedCacheObject> => {
   // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,no-return-await
   const enhancedFetch = async (url: RequestInfo, init: RequestInit) => await fetch(url, {
    ...init,
    headers: {
      ...init.headers,
      'Access-Control-Allow-Origin': '*',
      Cookie: ctx?.req.headers?.cookie ?? ''
    }
  }).then(response => {
    // ctx.res.setHeader('set-cookie', response.headers.get('set-cookie'))
    // console.log(response.headers.get('set-cookie'))

    return response
  })

  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: ApolloLink.from([
      errorLink,
      createHttpLink({
        uri: 'http://localhost:4000/graphql',
        fetchOptions: {
          mode: 'cors'
        },
        fetch: ctx ? enhancedFetch : fetch,
        credentials: 'include',
      })
    ]),
    cache: new InMemoryCache({})
  })
}

// const createApolloclient = (): ApolloClient<NormalizedCacheObject> => new ApolloClient({
//   ssrMode: typeof window === 'undefined',
//   link: new HttpLink({
//     uri: 'http://localhost:4000/graphql',
//     credentials: 'include',
//   }),
//   cache: new InMemoryCache({})
// })

export const initializeApollo = ({
  ctx,
  initialState
}: IInitializeApollo = {
  headers: null,
  initialState: null,
  ctx: null
}): ApolloClient<NormalizedCacheObject> => {
  const _apolloClient = apolloClient ?? createApolloclient(ctx)

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray, options) => [
        ...sourceArray,
        ...destinationArray.filter(d => {
          sourceArray.every(s => !isEqual(s, d))
        }),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }

  // For SSG and SSR always create a new Apollo Cliente
  if (typeof window === 'undefined') {
    apolloClient = _apolloClient
    return _apolloClient
  }
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export const useApollo = (iInitializeApollo: IInitializeApollo): ApolloClient<NormalizedCacheObject> => {
  const store = useMemo(() => initializeApollo(iInitializeApollo), [iInitializeApollo])
  return store
}
