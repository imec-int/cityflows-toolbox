import classnames from 'classnames'
import { AiOutlineMinusCircle } from 'react-icons/ai'
import { PropsWithChildren, SyntheticEvent } from 'react'

export type DeselectionButtonProps = {
  onClick: (e: SyntheticEvent) => void
  className?: string
} & PropsWithChildren

export function DeselectionBtn({
  onClick,
  className,
  children,
}: DeselectionButtonProps) {
  return (
    <button
      className={classnames('mb-1 leading-4 text-left', className)}
      onClick={onClick}
    >
      <span className="mr-1 flex align-center">
        <AiOutlineMinusCircle className="w-4 h-4" cursor="pointer" />
      </span>
      {children}
    </button>
  )
}
