import Link from 'next/link'
import Image from '@/components/Image'
import { Image as ImageT, Tag } from '@/lib/types'
import { getAvailableImageUrl, getPreferredImagePageUrl } from '@/services/image'
import styles from '@/styles/components/ImageCard.module.css'
import { getImageTitle } from '@/lib/utility'
import { nonBreakingSpace } from '@/lib/reactHelpers'

type Props = {
  hideTags?: boolean
  image: ImageT
}

export default function ImageCard({ hideTags, image }: Props) {
  const { tags } = image
  const title = getImageTitle(image.title)
  const tagsText = tags?.map?.((tag) => tag?.title).join(', ') || nonBreakingSpace
  const pageUrl = getPreferredImagePageUrl(image)
  const imageSrc = getAvailableImageUrl('no-border', image)

  const cardBodyClass = hideTags ? styles['hide-tags'] : ''

  return (
    <Link href={pageUrl} className='remove-text-decoration'>
      <div className={`card ${styles.card}`}>
        <div className={`${styles['square-wrapper']}`}>
          <Image
            alt={title}
            className={styles['image-element']}
            imageSrc={imageSrc}
            stretchFill
            title={title}
          />
        </div>
        <div className={`card-body ${cardBodyClass}`}>
          <h6 className={`card-title ${styles['image-title']}`}>{title}</h6>
          <div className={`card-text ${styles['card-text']}`}>{tagsText}</div>
        </div>
      </div>
    </Link>
  )
}
