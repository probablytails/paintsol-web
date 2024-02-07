import { faClose } from '@fortawesome/free-solid-svg-icons/faClose'
import Link from 'next/link'
import { KeyboardEventHandler, MouseEventHandler } from 'react'
import FAIcon from './FAIcon'
import Image from './Image'
import styles from '@/styles/components/ArtistLink.module.css'
import { getArtistProfilePictureUrl } from '@/services/artist'
import { Artist } from '@/lib/types'

type Props = {
  className?: string
  has_profile_picture?: boolean
  href?: string
  id?: number
  marginBottom?: boolean
  name: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  onKeyUp?: KeyboardEventHandler<HTMLButtonElement>
  onRemoveClick?: MouseEventHandler<HTMLButtonElement>
  onRemoveKeyUp?: KeyboardEventHandler<HTMLButtonElement>
  withBorder?: boolean
}

export default function ArtistLink({ className = '', has_profile_picture, href, id,
  marginBottom, name, onClick, onRemoveClick, onKeyUp, onRemoveKeyUp, withBorder }: Props) {
  const profilePictureAltTitle = `${name} profile picture`
  const profilePictureImageSrc = has_profile_picture && id
    ? getArtistProfilePictureUrl(id, 'original')
    : `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/profile-picture-default.png`
  
  const artistLinkClass = withBorder
    ? `${styles['artist-link']} ${styles['artist-link-with-border']}`
    : `${styles['artist-link']}`

  if (href) {
    return (
      <Link className={`${artistLinkClass} ${className} ${marginBottom ? styles['margin-bottom'] : ''}`} href={href}>
        <div className={styles['artist-text-wrapper']}>
          {
            profilePictureImageSrc && (
              <Image
                alt={profilePictureAltTitle}
                className={styles['profile-picture']}
                imageSrc={profilePictureImageSrc}
                title={profilePictureAltTitle}
              />
            )
          }
          {name}
        </div>
      </Link>
    )
  } else {
    return (
      <button
        className={`btn btn-link ${artistLinkClass} ${className} ${marginBottom ? styles['margin-bottom'] : ''}`}
        onClick={onRemoveClick || onClick}
        onKeyUp={onRemoveKeyUp || onKeyUp}
        type='button'>
        <div className={styles['artist-text-wrapper']}>
          {
            profilePictureImageSrc && (
              <Image
                alt={profilePictureAltTitle}
                className={styles['profile-picture']}
                imageSrc={profilePictureImageSrc}
                title={profilePictureAltTitle}
              />
            )
          }
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
