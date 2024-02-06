import { faClose } from '@fortawesome/free-solid-svg-icons/faClose'
import { KeyboardEventHandler, MouseEventHandler } from 'react'
import FAIcon from './FAIcon'
import styles from '@/styles/components/ArtistLink.module.css'
import Link from 'next/link'

type Props = {
  className?: string
  href?: string
  name: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  onKeyUp?: KeyboardEventHandler<HTMLButtonElement>
  onRemoveClick?: MouseEventHandler<HTMLButtonElement>
  onRemoveKeyUp?: KeyboardEventHandler<HTMLButtonElement>
}

export default function ArtistLink({ className = '', href, name, onClick, onRemoveClick,
  onKeyUp, onRemoveKeyUp }: Props) {
  if (href) {
    return (
      <Link className={`${styles['artist-link']} ${className}`} href={href}>
        <div className={styles['artist-text-wrapper']}>
          {name}
        </div>
      </Link>
    )
  } else {
    return (
      <button
        className={`btn btn-link ${styles['artist-link']} ${className}`}
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

}
