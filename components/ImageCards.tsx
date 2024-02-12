import ImageCard from '@/components/ImageCard'
import styles from '@/styles/components/ImageCards.module.css'
import { Image, ViewTypes } from '@/lib/types'

type Props = {
  endReached?: boolean
  hideTags?: boolean
  images: Image[]
  justifyContentCenter?: boolean
  viewType: ViewTypes
}

export default function ImageCards({ endReached, hideTags, images,
  justifyContentCenter, viewType }: Props) {
  const className = viewType === 'small'
    ? `col-sm-4 col-md-3 col-lg-2 ${styles['smallest-card']}`
    : `col-sm-6 col-md-4 col-lg-3 ${styles['smallest-card']}`

  const imageCards = images.map((image) => {
    return (
      <div
        className={className}
        key={`image-card-${image.id}`}>
        <ImageCard hideTags image={image} />
      </div>
    )
  })

  return (
    <div className={`row gx-3 mt-3 ${justifyContentCenter ? 'justify-content-center' : ''}`}>
      {imageCards}
      {
        endReached && (
          <div className={styles['end-reached']}>
            End of results
          </div>
        )
      }
    </div>
  )
}
