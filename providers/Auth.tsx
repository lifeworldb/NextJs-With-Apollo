// Libs
import {
  ReactNode,
  ReactElement,
  useEffect,
  SetStateAction,
  Dispatch,
  createContext,
  useState,
  useContext
} from 'react'

interface AuthContext {
  isAuthenticated: boolean
  setAuthenticated: Dispatch<SetStateAction<boolean>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAuthenticated: () => {}
})

/**
 * The initial value of `isAuthenticated` comes from the `authenticated`
 * prop which gets set by _app. We store that value in state and ignore
 * the prop from then on. The value can be changed by calling the
 * `setAuthenticated()` method in the context.
 */
export const AuthProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
  useEffect(() => {
    async function checkAuth (): Promise<void> {
      const response = await fetch('/api/checkAuth')
      if (response.status === 200) {
        try {
          const data = await response.json()
          if (data.auth) {
            setAuthenticated(true)
          } else {
            setAuthenticated(false)
          }
        } catch (e) {
          // do nothing
        }
      }
    }
    checkAuth()
  })
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth (): AuthContext {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useIsAuthenticated (): boolean {
  const context = useAuth()
  return context.isAuthenticated
}