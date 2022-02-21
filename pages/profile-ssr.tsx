// Libs
import { ReactElement } from 'react'
import { gql, useQuery } from '@apollo/client'
// Custom Functions
import { GetServerSideProps } from 'next'
import { initializeApollo, withAuth } from '@libs'
// Components

const Profile = ({ me }): ReactElement => {

  return (
    <>
      <h1>Profile</h1>
      <h2>Name: {me.userName}</h2>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const auth = await withAuth(ctx)

  if (Object.prototype.hasOwnProperty.call(auth, 'redirect')) {
    return auth
  }

  const apolloClient = initializeApollo({ ctx })

  const ME = gql`
    query Me {
      me {
        id
        userName
      }
    }
  `

  const { data } = await apolloClient.query({
    query: ME
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      me: data.me
    },
    revalidate: 1
  }
}

export default Profile