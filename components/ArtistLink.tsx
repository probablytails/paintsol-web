import { faClose } from '@fortawesome/free-solid-svg-icons/faClose'
import { KeyboardEventHandler, MouseEventHandler } from 'react'
import FAIcon from './FAIcon'
import styles from '@/styles/components/ArtistLink.module.css'

type Props = {
  name: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  onKeyUp?: KeyboardEventHandler<HTMLButtonElement>
  onRemoveClick?: MouseEventHandler<HTMLButtonElement>
  onRemoveKeyUp?: KeyboardEventHandler<HTMLButtonElement>
}

export default function ArtistLink({ name, onClick, onRemoveClick, onKeyUp, onRemoveKeyUp }: Props) {
  return (
    <button
      className={`btn btn-link ${styles['artist-link']}`}
      onClick={onRemoveClick || onClick}
      onKeyUp={onRemoveKeyUp || onKeyUp}
      type='button'>
      <div className={styles['artist-text-wrapper']}>
        {name}
        {
          !!onRemoveClick && !!onRemoveKeyUp && (
            <div className={styles['artist-remove-icon']}>
              <FAIcon
                className={styles['remove-icon']}
                icon={faClose}
                title={name}
              />
            </div>
          )
        }
      </div>
    </button>
  )
}
