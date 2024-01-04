import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { Router } from 'next/router'

import NProgress from 'nprogress'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from '@/store'

import 'nprogress/nprogress.css'
import '@/styles/global.css'
import {
	REQUEST_HEADER_AUTH_KEY,
	ACCESS_TOKEN_KEY, TOKEN_TYPE
} from 'core'
import axios from 'axios'
import Cookies from 'js-cookie'
import { isEmpty } from 'lodash'
import { IS_DEVELOPMENT } from '@/constants/app.constant'
import EmptyLayout from '@/layouts/EmptyLayout'

axios.interceptors.request.use(
	(config) => {
		const accessToken = Cookies.get(ACCESS_TOKEN_KEY.MEDICAL_ADMIN) ?? ''
		if(!isEmpty(accessToken)) {
			config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`
		}
		return config
	},
	async (error) => {
		if(IS_DEVELOPMENT) {
			console.error(error)
		}

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
		const originalConfig = err.config

		if(err.response) {
			if(unauthorizedCode.includes(err.response.status as number) && !originalConfig._retry) {
				originalConfig._retry = true
				Cookies.remove(ACCESS_TOKEN_KEY.MEDICAL_ADMIN)
				return Promise.reject(err.response.data)
			}

			if(forbidenCode.includes(err.response.status as number) && err.response.data) {
				return Promise.reject(err.response.data)
			}
		}

		return Promise.reject(err)
	}
)

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type ExtendedAppProps = AppProps & {
	Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: ExtendedAppProps) {
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

	// Get layout
	const getLayout = Component.getLayout ?? ((page) => <EmptyLayout>{page}</EmptyLayout>)
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				{getLayout(<Component {...pageProps} />)}
				<Toaster
					position='top-right'
					toastOptions={{ className: 'react-hot-toast' }}/>
			</QueryClientProvider>
		</Provider>
	)
}
