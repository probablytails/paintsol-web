import styles from '@/styles/components/ArtistHeader.module.css'
import { Artist } from '@/lib/types'
import Image from './Image'
import { getArtistProfilePictureUrl } from '@/services/artist'
import FAIcon from './FAIcon'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'

type Props = {
  artist: Artist
}

export default function ArtistHeader({ artist }: Props) {
  const altTitle = `${artist.name}'s profile photo`
  const imageSrc = artist.has_profile_picture
    ? getArtistProfilePictureUrl(artist.id, 'original')
    : `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/profile-picture-default.png`

  const twitterLink: string = artist.twitter_username
    ? `https://twitter.com/${artist.twitter_username}`
    : ''

  return (
    <div className={styles['artist-header']}>
      <div className={styles['left-wrapper']}>
        <Image
          alt={altTitle}
          className={styles['profile-picture']}
          imageSrc={imageSrc}
          title={altTitle}
        />
      </div>
      <div className={styles['right-wrapper']}>
        <div className={styles['right-top-wrapper']}>
          {
            twitterLink && (
              <Link
                aria-label={'X / Twitter Profile'}
                className={styles['social-icon-link']}
                href={twitterLink}
                rel='noopener noreferrer'
                target='_blank'
                title={'X / Twitter Profile'}>
                <FAIcon
                  className={styles['social-icon']}
                  icon={faXTwitter}
                  height={18}
                  width={18}
                />
              </Link>
            )
          }
        </div>
        <div className={styles['right-middle-wrapper']}>
          <div className={styles['name']}>{artist.name}</div>
        </div>
        <div className={styles['right-bottom-wrapper']} />
      </div>
    </div>
  )
}
