
// Libs
import { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import { GetServerSideProps } from 'next'
// Custom Functions
import { withOutAuth } from '@libs'
// Components
// Here
// Hooks
import { useAuth } from '@providers'

const LOGIN = gql`
  mutation login ($input: AuthInput!) {
    login (input: $input) {
      developerCode
      message
    }
  }
`

const Login = (): ReactElement => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, { data, loading, error }] = useMutation(LOGIN)
  const { setAuthenticated } = useAuth()
  const router = useRouter()
  const submitHandler = async (event): Promise<void> => {
    event.preventDefault()
    await login({
      variables: {
        input: {
          email: username,
          password
        }
      }
    })
  }

  useEffect(() => {
    if (data !== undefined) {
      if (data.login.developerCode === 'SUCCESS_QUERY') {
        setAuthenticated(true)
        router.push('/profile')
      }
    }
  }, [data, router, setAuthenticated])

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    console.error(error)
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label>
            Username{' '}
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password{' '}
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = withOutAuth

export default Login