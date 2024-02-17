import styles from '@/styles/components/CollectionHeader.module.css'
import { Collection } from '@/lib/types'
import Link from 'next/link'

type Props = {
  collection: Collection
}

export default function CollectionHeader({ collection }: Props) {

  let link = ''
  let linkTitle = ''
  if (collection.stickers_url) {
    if (collection.type === 'discord-stickers') {
      link = collection.stickers_url
      linkTitle = 'Get Discord Stickers'
    } else if (collection.type === 'telegram-stickers') {
      link = collection.stickers_url
      linkTitle = 'Get Telegram Stickers'
    }
  }

  return (
    <div className={styles['collection-header']}>
      {/* <div className={styles['left-wrapper']}>
        left side
      </div> */}
      <div className={styles['right-wrapper']}>
        {/* <div className={styles['right-top-wrapper']}>
          right top side
        </div> */}
        <div className={styles['right-middle-wrapper']}>
          <div className={styles['title']}>{collection.title}</div>
        </div>
        <div className={styles['right-bottom-wrapper']}>
          {
            link && linkTitle && (
              <Link
                className={`link-primary ${styles['link']}`}
                href={link}
                target='_blank'>
                {linkTitle}
              </Link>
            )
          }
        </div>
      </div>
    </div>
  )
}
