import { Image } from '@/lib/types'
import { ImageVersion } from '@/services/image'
import styles from '@/styles/components/ImageVersionLinks.module.css'
import { useRouter } from 'next/router'

type ImageVersionLinkProps = {
  image: Image
  imageVersion: ImageVersion
}

function ImageVersionLink({ imageVersion }: ImageVersionLinkProps) {
  const router = useRouter()

  const label = imageVersion === 'animation'
    ? 'animated'
    : imageVersion === 'border'
      ? 'border'
      : imageVersion === 'no-border'
        ? 'original'
        : null

  const onClick = () => {
    const newQueryParam = imageVersion === 'no-border' ? null : imageVersion
    const newUrl = `${router.asPath.split('?')[0]}${newQueryParam ? `?v=${newQueryParam}` : ''}`
    router.push(newUrl)
  }

  return (
    <button
      className={`btn btn-link ${styles['image-version-link']}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

type Props = {
  image: Image | null
}

export default function ImageVersionLinks({ image }: Props) {
  let totalLinks = 0
  if (image?.has_animation) totalLinks++
  if (image?.has_border) totalLinks++
  if (image?.has_no_border) totalLinks++
  const shouldShowVersions = totalLinks > 1

  return (
    <>
      {
        shouldShowVersions && (
          <div className={styles['image-versions']}>
            {image?.has_animation && <ImageVersionLink image={image} imageVersion='animation' />}
            {image?.has_border && <ImageVersionLink image={image} imageVersion='border' />}
            {image?.has_no_border && <ImageVersionLink image={image} imageVersion='no-border' />}
          </div>
        )
      }
    </>
  )
}
