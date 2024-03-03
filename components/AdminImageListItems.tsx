import { Image as ImageT } from '@/lib/types'
import styles from '@/styles/components/AdminImageListItems.module.css'
import AdminImageListItem from './AdminImageListItem'

type Props = {
  handleMove: any
  handleRemoveListItem: (id: number) => void
  images: ImageT[]
}

export default function AdminImageListItems({ handleMove, handleRemoveListItem, images }: Props) {
  const generateListItems = () => {
    return images.map((image) => (
      <AdminImageListItem
        key={`admin-image-list-item-${image.id}`}
        handleMove={handleMove}
        handleRemoveListItem={handleRemoveListItem}
        image={image} />
    ))
  }

  const listItems = generateListItems()

  return (
    <div className={styles['list-items']}>
      {listItems}
    </div>
  )
}
