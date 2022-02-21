// Libs
import { ReactElement } from 'react'
import type { AppProps, AppContext } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { useApollo, useStore } from '@libs'
import { AuthProvider } from '@providers'
import '../styles/globals.css'

function MyApp({Component, pageProps }: AppProps): ReactElement {
  const store = useStore(pageProps.initialReduxState)
  const apolloClient = useApollo({ initialState: pageProps.initialApolloState })
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    </Provider>
  )
}

interface Props {
  pageProps: unknown
}

MyApp.getInitialProps = async ({ Component, ctx }: AppContext): Promise<Props> => {
  const pageProps = {
    ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
  }

  return {
    pageProps
  }
}

export default MyApp
