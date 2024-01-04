import { FC, ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IS_CLIENT } from '@/constants/app.constant'

interface IWindowWrapperProps {
  children: ReactNode
}

const WindowWrapper: FC<IWindowWrapperProps> = ({ children }) => {
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false)
  const router = useRouter()
  useEffect(() => {
    if (IS_CLIENT) {
      setWindowReadyFlag(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  if (windowReadyFlag) return children
  else return null
}

export default WindowWrapper
