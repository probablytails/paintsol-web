import Link from 'next/link'
import { Artist } from '@/lib/types'
import { getNameOrAnonymous } from '@/lib/utility'
import { getAvailableImageUrl } from '@/services/image'
import { getArtistProfilePictureUrl, getPreferredArtistPageUrl } from '@/services/artist'
import styles from '@/styles/components/ArtistCard.module.css'
import Image from './Image'

type Props = {
  artist: Artist
}

export default function ArtistCard({ artist }: Props) {
  const name = getNameOrAnonymous(artist.name)
  const pageUrl = getPreferredArtistPageUrl(artist)
  const imageAltText = `${name} profile picture`
  const imageSrc = artist.has_profile_picture
    ? getArtistProfilePictureUrl(artist.id, 'original')
    : `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/profile-picture-default.png`
  const first6Images = artist?.images?.slice(0, 6) || []

  const generateImageElements = () => {
    let elements = []

    if (first6Images?.length > 0) {
      for (const image of first6Images) {
        const availableImageSrc = getAvailableImageUrl('no-border', image)
        
        elements.push(
          <div
            className={`col-sm-2 ${styles['artist-images-wrapper']}`}
            key={`${image.id}`}>
            <div className='square-wrapper'>
              <Image
                alt={name}
                className='image-element image-element-all-border-radius'
                imageSrc={availableImageSrc}
                priority
                stretchFill
                title={name}
              />
            </div>
          </div>
        )
      }
    }

    return elements
  }

  return (
    <Link href={pageUrl} className={`${styles['artist-card-wrapper']} remove-text-decoration`}>
      <div className={styles['artist-card']}>
        <div className={styles['artist-card-header']}>
          <div className={styles['artist-profile-picture']}>
            <Image
              alt={imageAltText}
              className={styles['profile-picture']}
              imageSrc={imageSrc}
              title={imageAltText}
            />
          </div>
          <div className={styles['artist-name']}>
            {name}
          </div>
        </div>
        {
          first6Images?.length > 0 && (
            <div className={styles['artist-images']}>
              {generateImageElements()}
            </div>
          )
        }
      </div>
    </Link>
  )
}
