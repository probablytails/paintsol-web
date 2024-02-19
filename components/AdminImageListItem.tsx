import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { Image as ImageT } from '@/lib/types'
import { getTitleOrUntitled } from '@/lib/utility'
import { getAvailableImageUrl } from '@/services/image'
import styles from '@/styles/components/AdminImageListItem.module.css'
import FAIcon from './FAIcon'
import Image from './Image'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'

type Props = {
  handleMove: (id: number, toPosition: 'up' | 'down') => void
  handleRemoveListItem: (id: number) => void
  image: ImageT
}

export default function AdminImageListItem({ handleMove, handleRemoveListItem, image }: Props) {
  const title = getTitleOrUntitled(image.title)
  const imageAlt = `${title} image`
  const availableImageSrc = getAvailableImageUrl('no-border', image)

  return (
    <div className={styles['list-item-wrapper']}>
      <div className={styles['list-item-reorder-wrapper']}>
        <FAIcon
          className={styles['list-item-arrow']}
          icon={faArrowUp}
          onClick={(() => handleMove(image.id, 'up')) as any}
          title='Move up'
        />
        <FAIcon
          className={styles['list-item-arrow']}
          icon={faArrowDown}
          onClick={(() => handleMove(image.id, 'down')) as any}
          title='Move down'
        />
      </div>
      <div className={`square-wrapper ${styles['list-item-image-wrapper']}`}>
        <Image
          alt={imageAlt}
          className='image-element image-element-all-border-radius'
          imageSrc={availableImageSrc}
          priority
          stretchFill
          title={imageAlt}
        />
      </div>
      <div className={styles['list-item-title']}>
        {title}
      </div>
      <FAIcon
        className={styles['list-item-remove']}
        icon={faTimes}
        onClick={handleRemoveListItem as any}
        title='Remove from collection'
      />
    </div>
  )
}
