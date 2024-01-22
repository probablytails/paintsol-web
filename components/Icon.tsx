import Image from "next/image";
import styles from '@/styles/components/Icon.module.css';

type Props = {
  height: number
  imageSrc: string
  width: number
}

export default function Icon({ height, imageSrc, width }: Props) {
  return (
    <div className={`icon ${styles.icon}`}>
      <Image
        src={imageSrc}
        alt="MS $Paint Logo"
        width={width}
        height={height}
        priority
      />
    </div>
  )
}
