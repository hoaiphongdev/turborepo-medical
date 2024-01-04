import {
	ACCESS_TOKEN_KEY,
	APP_PREFIX_ADMIN,
	APP_PREFIX_EU
} from '@/constants/app.constant'
import { isEmpty } from 'lodash'

export const withProtectedRoute = (
	customPropsFunction: (context: any) => Promise<any>
) => async (
	context: any,
	site: typeof APP_PREFIX_ADMIN | typeof APP_PREFIX_EU = APP_PREFIX_ADMIN
) => {
	const accessToken: string | null = context?.req?.cookies[ACCESS_TOKEN_KEY[site]]

	if(isEmpty(accessToken)) {
		return {
			redirect: {
				destination: '/sign-in',
				permanent: false
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return await customPropsFunction(context)
}