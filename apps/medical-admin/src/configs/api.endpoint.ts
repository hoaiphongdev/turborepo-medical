import { apiEndpoint } from 'core'

export const api = {
  ...apiEndpoint(process.env.NEXT_PUBLIC_API_HOST)
}
