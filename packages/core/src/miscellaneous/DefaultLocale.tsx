import { useEffect } from 'react'
import { getLocalStorage } from '@/utilities/storage'
import {
	APP_PREFIX_ADMIN,
	APP_PREFIX_EU,
	LOCALE_KEY
} from '@/constants/app.constant'
import { useRouter } from 'next/router'

export const DefaultLocale = (site: typeof APP_PREFIX_ADMIN | typeof APP_PREFIX_EU) => {
	const locale = getLocalStorage(LOCALE_KEY[site])
	const router = useRouter()
	const { asPath } = router
	useEffect(() => {
		// if(query && !isEmpty(query)) {
		if(locale && locale !== 'vi') {
			const currentURL = window.location.href
			const currentPath = window.location.pathname

			const basePath = currentPath.startsWith('/') ? '' : '/'
			const newPath = `${basePath}/${locale}${currentPath}`.replace(/\/{2,}/g, '/')
			const pathSegment = Array.from(new Set(newPath.split('/'))).join('/')

			const newURL = `${window.location.protocol}//${window.location.host}${pathSegment}`

			if(newURL !== currentURL) {
				router.replace(asPath, asPath, { locale })
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locale])

	return <></>
}