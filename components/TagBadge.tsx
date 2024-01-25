import { faClose } from '@fortawesome/free-solid-svg-icons/faClose'
import { KeyboardEventHandler, MouseEventHandler } from 'react'
import FAIcon from './FAIcon'
import styles from '@/styles/components/TagBadge.module.css'

type Props = {
  onRemoveClick: MouseEventHandler<HTMLButtonElement>
  onRemoveKeyUp: KeyboardEventHandler<HTMLButtonElement>
  title: string
}

export default function TagBadge({ id, onRemoveClick, onRemoveKeyUp, title }: Props) {
  return (
    <button
      className={`btn rounded-pill btn-secondary  ${styles['tag-badge']}`}
      onClick={onRemoveClick}
      onKeyUp={onRemoveKeyUp}
      type='button'>
      <div className={styles['tag-text-wrapper']}>
        {title}
        <FAIcon
          className={styles['remove-icon']}
          icon={faClose}
          title={title}
        />
      </div>
    </button>
  )
}
