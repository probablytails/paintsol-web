import NextImage from 'next/image'
import { CSSProperties, MouseEventHandler, ReactEventHandler } from 'react'

type Props = {
  alt: string
  className?: string
  height?: number
  imageSrc: string
  innerRef?: any
  onClick?: MouseEventHandler<HTMLImageElement>
  onLoad?: ReactEventHandler<HTMLImageElement>
  priority?: boolean
  stretchFill?: boolean
  title: string
  width?: number
}

export default function Image({ alt, className, height = 0, imageSrc,
  innerRef, onClick, onLoad, priority, stretchFill, title, width = 0 }: Props) {

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
      onLoad={onLoad}
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
