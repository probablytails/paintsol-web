import ImageCard from "@/components/ImageCard";
import styles from "@/styles/components/ImageCards.module.css";

type ImageCardItem = {
  imageSrc: string
  tags: string[]
  title: string
}

type Props = {
  items: ImageCardItem[]
}

export default function ImageCards({ items }: Props) {
  const imageCards = items.map((item: ImageCardItem) => (
    <div
      className={`col-sm-6 col-md-4 col-lg-3 col-xl-2 ${styles['smallest-card']}`}
      key={`div-${item.title}`}>
      <ImageCard
        imageSrc={item.imageSrc}
        key={item.title}
        tags={item.tags}
        title={item.title}
      />
    </div>
  ))

  return (
    <div className="row gx-3 mt-4">
      {imageCards}
    </div>
  )
}
