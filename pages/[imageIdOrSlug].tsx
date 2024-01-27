import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import url from 'url'
import { Image as ImageT, UserInfo } from '@/lib/types'
import { getAvailableImageUrl, getImage, getImageUrl } from '@/services/image'
import Image from '@/components/Image'
import styles from '@/styles/ImageIdOrSlug.module.css'
import TagBadge from '@/components/TagBadge'
import { useSearchParams } from 'next/navigation'
import FAIcon from '@/components/FAIcon'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import { getImageTitle } from '@/lib/utility'
import ImageVersionLinks from '@/components/ImageVersionLinks'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'

type Props = {
  initialImage: ImageT | null
  userInfo?: UserInfo
}

export const getServerSideProps = (async ({ req, res }: any) => {
  const pathAfterDomain = req?.url && url?.parse(req?.url)?.pathname?.slice(1)
  let initialImage: ImageT | null = null

  if (pathAfterDomain) {
    try {
      const data = await getImage(pathAfterDomain, true)
      if (data) {
        initialImage = data
      }
      if (data?.id === parseInt(pathAfterDomain) && data?.slug) {
        res.writeHead(302, { Location: `/${data.slug}` })
        res.end()
      }
    } catch (error: any) {
      console.log('[imageIdOrSlug].tsx getServerSideProps error', error)
    }
  }

  return { props: { initialImage } }
})

export default function ImagePage({ initialImage, userInfo }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [image, setImage] = useState<ImageT | null>(initialImage)
  const [imageSrc, setImageSrc] = useState('')
  const { nextId, prevId, tags } = image || {}
  const title = getImageTitle(image?.title || null)
  const artist = image?.artist || ''

  useEffect(() => {
    (async () => {
      const idOrSlug = router.asPath?.replace(/\//, '')
      if (idOrSlug !== '[imageIdOrSlug]') {
        try {
          const paramImageVersion = searchParams.get('v') as any
          const data = await getImage(idOrSlug)
          setImage(data)
          const imageUrl = getAvailableImageUrl(paramImageVersion, data)
          setImageSrc(imageUrl)

        } catch (error: any) {
          if (error?.response?.status === 404) {
            router.replace('/gallery')
          }
        }
      }
    })()
  }, [searchParams])

  const tagBadges = tags?.map((tag) => {
    const tagTitle = tag?.title
    return (
      <TagBadge
        key={`tag-${tagTitle}`}
        title={tagTitle}
      />
    )
  })

  const metaTitle = title
  const metaDescription = `${title} ${artist ? `– by ${artist}` : ''}`
  const paramImageVersion = searchParams.get('v') as any
  const metaImageUrl = getAvailableImageUrl(paramImageVersion, image)

  const prevNav = (
    <Link className={styles['prev-svg']} href={`/${prevId}`}>
      <FAIcon
        icon={faArrowLeft}
        title='Go to previous image'
      />
    </Link>
  )

  const nextNav = (
    <Link className={styles['next-svg']} href={`/${nextId}`}>
      <FAIcon
        icon={faArrowRight}
        title='Go to next image'
      />
    </Link>
  )

  return (
    <>
      <Head>
        <title>{`$PAINT – ${title}`}</title>
        <meta name='description' content={metaDescription} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MSPaintSOL" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImageUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImageUrl} />
        <meta property="og:type" content="website" />
      </Head>
      <div className='container-fluid main-content-column overflow-y-scroll'>
        <div className='main-content-inner-wrapper'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-2 col-md-1 d-none d-md-block'>
                <div className={styles['prev']}>
                  {prevId && prevId > 0 && prevNav}
                </div>
              </div>
              <div className='col-lg-8 col-md-10'>
                <div className='row'>
                  <h2>{title}</h2>
                </div>
                <div className='row'>
                  <div className='col-md-8'>
                    {tagBadges}
                  </div>
                  <div className='col-md-4 ml'>
                    <ImageVersionLinks image={image} />
                  </div>
                </div>
                {
                  !!image?.artist && (
                    <div className={styles.artist}>{`${image.artist}`}</div>
                  )
                }
                {
                  !!userInfo && (
                    <button
                      className={`btn btn-warning btn-rounded ${styles['edit-button']}`}
                      onClick={() => router.push(`/admin/upload-image?editId=${image?.id}`)}
                      type="button">
                      <FAIcon
                        className={styles['edit-icon']}
                        icon={faEdit}
                        title='Edit'
                      />
                      Edit
                    </button>
                  )
                }
                {
                  imageSrc && (
                    <Image
                      alt={title}
                      className={`${styles['main-image']}`}
                      imageSrc={imageSrc}
                      priority
                      stretchFill
                      title={title}
                    />
                  )
                }
              </div>
              <div className='col-lg-2 col-md-1 d-none d-md-block'>
                <div className={styles['next']}>
                  {nextId && nextId > 1 && nextNav}
                </div>
              </div>
            </div>
            <div className={`d-block d-md-none d-lg-none d-xl-none d-xxl-none ${styles['small-screen-navs']}`}>
              <div className={styles['prev']}>
                {prevId && prevId > 0 && prevNav}
              </div>
              <div className={styles['next']}>
                {nextId && nextId > 1 && nextNav}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
