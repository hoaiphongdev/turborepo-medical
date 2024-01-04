import { useState } from 'react'

type UseModalReturnType = [boolean, () => void]

export const useModal = (): UseModalReturnType => {
  const [open, setOpen] = useState<boolean>(false)

  const toggleModal = (): void => {
    setOpen(!open)
  }

  return [open, toggleModal]
}
