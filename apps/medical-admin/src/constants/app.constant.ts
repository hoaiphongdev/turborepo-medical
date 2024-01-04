export const IS_SERVER = typeof window === 'undefined'
export const IS_CLIENT = typeof window !== 'undefined'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const API_URL = process.env.NEXT_PUBLIC_API_HOST
export const API_LOCAL_URL = process.env.NEXT_PUBLIC_API_LOCAL_HOST
export const APP_NAME = 'Medical'
export const APP_PREFIX = 'MEDICAL'
export const LOCALE_KEY = `${APP_PREFIX}_LOCALE`
export const ACCESS_TOKEN_KEY = `${APP_PREFIX}_ACCESS_TOKEN`
export const REFRESH_TOKEN_KEY = `${APP_PREFIX}_REFRESH_TOKEN`
export const SETTING_TOKEN_KEY = `${APP_PREFIX}_SETTING`
export const REQUEST_RETURN_KEY = `${APP_PREFIX}_REQUEST_RETURN`
export const REDIRECT_URL_KEY = 'redirectUrl'
export const RECENT_SEARCH = `${APP_PREFIX}_RECENT_SEARCH`
export const GUEST_CART_ID = `${APP_PREFIX}_GUEST_CART_ID`
export const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const OS_LIST = {
  MAC_OS: 'Mac OS',
  IOS: 'IOS',
  WINDOWS: 'Windows',
  ANDROID: 'Android',
  LINUX: 'Linux'
}
