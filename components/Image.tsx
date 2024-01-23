import NextImage from 'next/image'
import { CSSProperties } from 'react'

type Props = {
  alt: string
  className?: string
  height?: number
  imageSrc: string
  priority?: boolean
  stretchFill?: boolean
  title: string
  width?: number
}

export default function Image({ alt, className, height = 0, imageSrc,
  priority, stretchFill, title, width = 0 }: Props) {

  const style: CSSProperties = {}
  if (stretchFill) {
    style.width = '100%'
    style.height = 'auto'
  }
  
  return (
    <NextImage
      alt={alt}
      className={className}
      height={height}
      priority={priority}
      src={imageSrc}
      title={title}
      unoptimized
      style={style}
      width={width}
    />
  )
}
