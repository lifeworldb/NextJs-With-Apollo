// Libs
import { ReactElement } from 'react'
import { gql, useQuery } from '@apollo/client'
// Custom Functions
import { GetServerSideProps } from 'next'
import { withAuth } from '@libs'
// Components


const ME = gql`
  query Me {
    me {
      id
      userName
    }
  }
`

const Profile = (): ReactElement => {
  const { data, loading, error } = useQuery(ME, { pollInterval: 2000 })

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    console.error(error)
  }

  const { me } = data

  return (
    <>
      <h1>Profile</h1>
      <h2>Name: {me.userName}</h2>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = withAuth

export default Profile