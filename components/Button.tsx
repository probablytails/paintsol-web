import { MouseEventHandler } from 'react'
import FAIcon from './FAIcon'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'

type Props = {
  children: string
  className: string
  isLoading?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  type: 'button' | 'submit' | 'reset' | undefined
}

export default function Button({ children, className, isLoading, onClick, type }: Props) {
  return (
    <button
      className={className}
      disabled={isLoading}
      onClick={onClick}
      type={type}>
      {
        isLoading && (
          <FAIcon 
            icon={faSpinner}
            spin
            title='Loading...'
          />
        )
      }
      {!isLoading && children}
    </button>
  )
}
