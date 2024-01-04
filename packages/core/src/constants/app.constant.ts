export const IS_SERVER = typeof window === 'undefined'
export const IS_CLIENT = typeof window !== 'undefined'

export const APP_NAME_ADMIN = 'Medical Admin'
export const APP_NAME_EU = 'Medical EU'
export const APP_PREFIX_ADMIN = 'MEDICAL_ADMIN'
export const APP_PREFIX_EU = 'MEDICAL_EU'

export const LOCALE_KEY = {
	[APP_PREFIX_ADMIN]: `${APP_PREFIX_ADMIN}_LOCALE`,
	[APP_PREFIX_EU]: `${APP_PREFIX_EU}_LOCALE`
}

export const ACCESS_TOKEN_KEY = {
	[APP_PREFIX_ADMIN]: `${APP_PREFIX_ADMIN}_ACCESS_TOKEN`,
	[APP_PREFIX_EU]: `${APP_PREFIX_EU}_ACCESS_TOKEN`
}
export const ACCESS_TOKEN_KEY_EU = `${APP_PREFIX_EU}_ACCESS_TOKEN`
