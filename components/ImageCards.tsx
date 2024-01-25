import ImageCard from '@/components/ImageCard'
import LoadingSpinner from './LoadingSpinner'
import styles from '@/styles/components/ImageCards.module.css'
import { Image, Tag } from '@/lib/types'

type Props = {
  isLoading: boolean
  images: Image[]
}

export default function ImageCards({ isLoading, images }: Props) {
  const imageCards = images.map((image) => {
    return (
      <div
        className={`col-sm-6 col-md-4 col-lg-3 ${styles['smallest-card']}`}
        key={`image-card-${image.id}`}>
        <ImageCard image={image} />
      </div>
    )
  })


  return (
    <div className='row gx-3 mt-4'>
      {
        isLoading && (
          <LoadingSpinner />
        )
      }
      {
        !isLoading && (imageCards)
      }
    </div>
  )
}
