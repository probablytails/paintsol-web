import Image from "next/image";

type Props = {
  height: number
  imageSrc: string
  title: string
  width: number
}

export default function Icon({ height, imageSrc, title, width }: Props) {
  return (
    <div>
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
