// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Store Imports
import store from 'store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'configs/i18n'
// import { defaultACLObj } from 'configs/acl'
import themeConfig from 'configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'layouts/UserLayout'
import ThemeComponent from '@core/theme/ThemeComponent'
import AuthGuard from '@core/components/auth/AuthGuard'
import GuestGuard from '@core/components/auth/GuestGuard'

// ** Spinner Import
import Spinner from '@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'context/AuthContext'
import { SettingsConsumer, SettingsProvider } from '@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from '@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'core'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactElement, ReactNode, useEffect, useState } from 'react'

import { REQUEST_HEADER_AUTH_KEY, ACCESS_TOKEN_KEY, TOKEN_TYPE } from 'core'
import axios from 'axios'
import { isEmpty } from 'lodash'

// ** Global css styles
import 'iconify-bundle/icons-bundle-react'
import 'nprogress/nprogress.css'
import 'styles/global.css'

axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY.MEDICAL_ADMIN) ?? ''
    if (!isEmpty(accessToken)) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`
    }
    return config
  },
  async (error) => {
    return Promise.reject(error)
  }
)

const unauthorizedCode = [401]
const forbidenCode = [403]
axios.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    console.log('ERROR AXIOS', err)

    if (err.response) {
      if (unauthorizedCode.includes(err.response.status as number)) {
        // originalConfig._retry = true
        // localStorage.removeItem(ACCESS_TOKEN_KEY.MEDICAL_ADMIN)
        // localStorage.removeItem('userData')
        return Promise.reject(err.response.data)
      }

      if (forbidenCode.includes(err.response.status as number) && err.response.data) {
        return Promise.reject(err.response.data)
      }
    }

    return Promise.reject(err)
  }
)

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type ExtendedAppProps = AppProps & {
  Component: NextPageWithLayout
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    const start = () => NProgress.start()
    const done = () => NProgress.done()

    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', done)
    Router.events.on('routeChangeError', done)

    return () => {
      Router.events.off('routeChangeStart', start)
      Router.events.off('routeChangeComplete', done)
      Router.events.off('routeChangeError', done)
    }
  }, [])

  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? ((page) => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  // const aclAbilities = Component.acl ?? defaultACLObj
  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName}`}</title>
          <meta name="description" content={`${themeConfig.templateName}`} />
        </Head>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        {getLayout(<Component {...pageProps} />)}
                      </Guard>
                      <ReactHotToast>
                        <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                      </ReactHotToast>
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </CacheProvider>
    </Provider>
  )
}
export default App
