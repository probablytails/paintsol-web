import Link from 'next/link'
import Image from '@/components/Image'
import { Image as ImageT, Tag } from '@/lib/types'
import { getAvailableImageUrl, getAvailableImageVersion, getPreferredImagePageUrl } from '@/services/image'
import styles from '@/styles/components/ImageCard.module.css'
import { getImageTitle } from '@/lib/utility'

type Props = {
  image: ImageT
}

export default function ImageCard({ image }: Props) {
  const { tags } = image
  const title = getImageTitle(image.title)
  const tagsText = tags?.map?.((tag) => tag?.title).join(', ')
  const pageUrl = getPreferredImagePageUrl(image)
  const imageSrc = getAvailableImageUrl('no-border', image)

  return (
    <Link href={pageUrl}>
      <div className={`card ${styles.card}`}>
        <Image
          alt={title}
          imageSrc={imageSrc}
          stretchFill
          title={title}
        />
        <div className='card-body'>
          <h6 className="card-title">{title}</h6>
          {
            tagsText?.length > 0 && (
              <div className={`card-text ${styles['card-text']}`}>{tagsText}</div>
            )
          }
        </div>
      </div>
    </Link>
  )
}
