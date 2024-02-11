import styles from '@/styles/components/ArtistHeader.module.css'
import { Artist } from '@/lib/types'
import Image from './Image'
import { getArtistProfilePictureUrl } from '@/services/artist'
import FAIcon from './FAIcon'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram'
import Icon from './Icon'

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

  const decaLink: string = artist.deca_username
    ? `https://deca.art/${artist.deca_username}`
    : ''

  const foundationLink: string = artist.foundation_username
    ? `https://foundation.app/@${artist.foundation_username}`
    : ''

  const instagramLink: string = artist.instagram_username
    ? `https://instagram.com/${artist.instagram_username}`
    : ''

  const superrareLink: string = artist.superrare_username
    ? `https://superrare.com/${artist.superrare_username}`
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
          {
            instagramLink && (
              <Link
                aria-label={'Instagram Profile'}
                className={styles['social-icon-link']}
                href={instagramLink}
                rel='noopener noreferrer'
                target='_blank'
                title={'Instagram Profile'}>
                <FAIcon
                  className={styles['social-icon']}
                  icon={faInstagram}
                  height={18}
                  width={18}
                />
              </Link>
            )
          }
          {
            decaLink && (
              <Link
                aria-label={'Deca Profile'}
                className={styles['social-icon-image-link']}
                href={decaLink}
                rel='noopener noreferrer'
                style={{ marginTop: '2px' }}
                target='_blank'
                title={'Deca Profile'}>
                <Icon
                  height={17}
                  imageSrc={'/external-sites/deca.png'}
                  title={'Deca Profile'}
                  width={17}
                />
              </Link>
            )
          }
          {
            superrareLink && (
              <Link
                aria-label={'SuperRare Profile'}
                className={styles['social-icon-image-link']}
                href={superrareLink}
                rel='noopener noreferrer'
                style={{ marginTop: '0px' }}
                target='_blank'
                title={'SuperRare Profile'}>
                <Icon
                  height={20}
                  imageSrc={'/external-sites/superrare.png'}
                  title={'SuperRare Profile'}
                  width={20}
                />
              </Link>
            )
          }
          {
            foundationLink && (
              <Link
                aria-label={'Foundation Profile'}
                className={styles['social-icon-image-link']}
                href={foundationLink}
                rel='noopener noreferrer'
                style={{ marginTop: '-1px' }}
                target='_blank'
                title={'Foundation Profile'}>
                <Icon
                  height={22}
                  imageSrc={'/external-sites/foundation.png'}
                  title={'Foundation Profile'}
                  width={22}
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
