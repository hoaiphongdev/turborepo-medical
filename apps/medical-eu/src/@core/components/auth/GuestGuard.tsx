// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children } = props
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    // const token = localStorage.getItem(ACCESS_TOKEN_KEY.MEDICAL_ADMIN)
    // if (token) {
    //   // router.replace('/')
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  // if (auth.loading) {
  //   return fallback
  // }

  return <>{children}</>
}

export default GuestGuard
