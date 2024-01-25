import { faClose } from '@fortawesome/free-solid-svg-icons/faClose'
import { KeyboardEventHandler, MouseEventHandler } from 'react'
import FAIcon from './FAIcon'
import styles from '@/styles/components/TagBadge.module.css'

type Props = {
  onClick?: MouseEventHandler<HTMLButtonElement>
  onKeyUp?: KeyboardEventHandler<HTMLButtonElement>
  onRemoveClick?: MouseEventHandler<HTMLButtonElement>
  onRemoveKeyUp?: KeyboardEventHandler<HTMLButtonElement>
  title: string
}

export default function TagBadge({ onClick, onRemoveClick, onKeyUp, onRemoveKeyUp, title }: Props) {
  return (
    <button
      className={`btn rounded-pill btn-outline-success  ${styles['tag-badge']}`}
      onClick={onRemoveClick || onClick}
      onKeyUp={onRemoveKeyUp || onKeyUp}
      type='button'>
      <div className={styles['tag-text-wrapper']}>
        {title}
        {
          !!onRemoveClick && !!onRemoveKeyUp && (
            <FAIcon
              className={styles['remove-icon']}
              icon={faClose}
              title={title}
            />
          )
        }
      </div>
    </button>
  )
}
