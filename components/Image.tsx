import NextImage from 'next/image'
import { CSSProperties, MouseEventHandler } from 'react'

type Props = {
  alt: string
  className?: string
  height?: number
  imageSrc: string
  innerRef?: any
  onClick?: MouseEventHandler<HTMLImageElement>
  priority?: boolean
  stretchFill?: boolean
  title: string
  width?: number
}

export default function Image({ alt, className, height = 0, imageSrc,
  innerRef, onClick, priority, stretchFill, title, width = 0 }: Props) {

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
      onClick={onClick}
      priority={priority}
      ref={innerRef}
      src={imageSrc}
      title={title}
      unoptimized
      style={style}
      width={width}
    />
  )
}
