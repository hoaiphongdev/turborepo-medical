import clsx from 'clsx'
import { ButtonHTMLAttributes, FC } from 'react'

type DefaultButtonVariants = {
  default: string
  outline: string
  outlineTransparent: string
  color: string
}

type DefaultSizeVariants = {
  default: string
  sm: string
  lg: string
  full: string
}

export type IButtonProps = {
  variant?: keyof DefaultButtonVariants
  size?: keyof DefaultSizeVariants
  isLoading?: boolean
  type?: 'button' | 'submit'
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button: FC<IButtonProps> = ({
  className,
  children,
  variant = 'default',
  isLoading,
  size = 'default',
  color = 'primary-blue',
  type = 'button',
  ...props
}) => {
  const buttonVariants: DefaultButtonVariants = {
    default: `bg-${color}-300 text-white hover:bg-${color}-400`,
    outline: `bg-white border border-${color} `,
    outlineTransparent: `bg-transparent border border-${color}`,
    color: `bg-${color}`
  }

  const sizeVariants: DefaultSizeVariants = {
    default: 'h-10 w-[128px] sm:py-4 py-2',
    sm: 'h-8 w-[128px] p-4',
    lg: 'h-12 w-[128px] p-4',
    full: 'w-full '
  }

  const buttonClass = clsx(
    `duration-150 inline-flex items-center justify-center rounded text-p14 transition-color disabled:opacity-50 disabled:pointer-events-none`,
    buttonVariants[variant],
    sizeVariants[size],
    className
  )

  return (
    <button type={type} className={buttonClass} disabled={isLoading} {...props}>
      {children}
    </button>
  )
}
