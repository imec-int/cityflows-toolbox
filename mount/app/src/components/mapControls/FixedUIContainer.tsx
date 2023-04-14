import React, { PropsWithChildren } from 'react'
import classnames from 'classnames'
import { PropsWithClassName } from '../../utils'

export type FixedUIContainerProps = PropsWithChildren & PropsWithClassName

export const FixedUIContainer: React.FC<FixedUIContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={classnames(
        'fixed z-1000',
        'flex-col justify-center items-center',
        'bg-white',
        'outline outline-2 outline-slate-900/[.2] rounded-md',
        className
      )}
    >
      {children}
    </div>
  )
}
