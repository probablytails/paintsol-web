import Image from '@/components/Image'
import styles from '@/styles/components/ImageCard.module.css'

type Props = {
  imageSrc: string
  tags: string[]
  title: string
}

export default function ImageCard({ imageSrc, tags, title }: Props) {
  const tagsText = tags.join(', ')

  return (
    <div className={`card ${styles.card}`}>
      <Image
        alt={title}
        imageSrc={imageSrc}
        priority
        stretchFill
        title={title}
      />
      <div className='card-body'>
        <h6 className="card-title">{title}</h6>
        <div className={`card-text ${styles['card-text']}`}>{tagsText}</div>
      </div>
    </div>
  )
}
