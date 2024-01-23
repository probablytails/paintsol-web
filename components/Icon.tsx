import Image from "@/components/Image";

type Props = {
  height: number
  imageSrc: string
  title: string
  width: number
}

export default function Icon({ height, imageSrc, title, width }: Props) {
  return (
    <Image
      alt={title}
      imageSrc={imageSrc}
      width={width}
      height={height}
      priority
      title={title}
    />
  )
}
