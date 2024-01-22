import Image from "next/image";
import styles from '@/styles/components/Icon.module.css';

type Props = {
  height: number
  imageSrc: string
  title: string
  width: number
}

export default function Icon({ height, imageSrc, title, width }: Props) {
  return (
    <div className={`icon ${styles.icon}`}>
      <Image
        src={imageSrc}
        alt={title}
        width={width}
        height={height}
        priority
      />
    </div>
  )
}
