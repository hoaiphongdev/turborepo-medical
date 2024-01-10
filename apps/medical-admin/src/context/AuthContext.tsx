// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import { ACCESS_TOKEN_KEY, TOKEN_TYPE } from 'core'
import { api } from 'configs/api.endpoint'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY.MEDICAL_ADMIN)
      if (storedToken) {
        setLoading(true)
        await axios
          .post(`${api.AUTH}/me`, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async (response) => {
            setLoading(false)
            const userdata = { id: response.data.data._id, ...response.data.data }
            localStorage.setItem('userData', JSON.stringify(userdata))
            setUser(userdata)
          })
          .catch(() => {
            localStorage.removeItem(ACCESS_TOKEN_KEY.MEDICAL_ADMIN)
            localStorage.removeItem('userData')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(`${api.AUTH}/login`, params)
      .then(async (response) => {
        const token = response.data.data.accessToken
        localStorage.setItem(ACCESS_TOKEN_KEY.MEDICAL_ADMIN, response.data.data.accessToken)
        // Cookies.set(ACCESS_TOKEN_KEY.MEDICAL_ADMIN, response.data.data.accessToken)

        // LOGIN
        await axios
          .post(`${api.AUTH}/me`, null, {
            headers: {
              Authorization: `${TOKEN_TYPE}${token}`
            }
          })
          .then(async (response) => {
            setLoading(false)
            const userdata = { id: response.data.data._id, ...response.data.data }
            localStorage.setItem('userData', JSON.stringify(userdata))
            setUser(userdata)
          })
          .catch(() => {
            localStorage.removeItem(ACCESS_TOKEN_KEY.MEDICAL_ADMIN)
            localStorage.removeItem('userData')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
        // LOGIN

        // params.rememberMe
        //   ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
        //   : null
        const returnUrl = router.query.returnUrl
        // // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch((err) => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('userData')
    localStorage.removeItem(ACCESS_TOKEN_KEY.MEDICAL_ADMIN)
    router.replace('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
