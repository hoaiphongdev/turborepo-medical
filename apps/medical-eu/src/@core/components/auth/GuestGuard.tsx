// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'hooks/useAuth'
import Cookies from 'js-cookie'
import { ACCESS_TOKEN_KEY } from 'core'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  const token = Cookies.get(ACCESS_TOKEN_KEY.MEDICAL_ADMIN)

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (token) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
