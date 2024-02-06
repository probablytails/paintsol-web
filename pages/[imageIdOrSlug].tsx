import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import ArtistLink from '@/components/ArtistLink'
import FullImageModal from '@/components/FullImageModal'
import Image from '@/components/Image'
import ImageVersionLinks from '@/components/ImageVersionLinks'
import LoadingSpinner from '@/components/LoadingSpinner'
import TagBadge from '@/components/TagBadge'
import FAIcon from '@/components/FAIcon'
import { getImageTitle } from '@/lib/utility'
import { Artist, Image as ImageT, Tag, UserInfo } from '@/lib/types'
import { getAvailableImageUrl, getImage } from '@/services/image'
import styles from '@/styles/ImageIdOrSlug.module.css'
import { faStar } from '@fortawesome/free-regular-svg-icons'

type Props = {
  initialImage: ImageT | null
  userInfo?: UserInfo
}

type ServerSidePropsParams = {
  imageIdOrSlug?: string
}

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
  const { params, res } = context
  const { imageIdOrSlug } = params as ServerSidePropsParams
  let initialImage: ImageT | null = null

  if (imageIdOrSlug) {
    try {
      const data = await getImage(imageIdOrSlug, true)
      if (data) {
        initialImage = data
      }
      if (data?.id === parseInt(imageIdOrSlug) && data?.slug) {
        res.writeHead(302, { Location: `/${data.slug}` })
        res.end()
      }
    } catch (error: any) {
      //
    }
  }

  return { props: { initialImage } }
})

export default function ImagePage({ initialImage, userInfo }: Props) {
  const router = useRouter()
  console.log('initialImage', initialImage)
  const searchParams = useSearchParams()
  const closeButtonRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [imagedFinishedLoading, setImagedFinishedLoading] = useState<boolean>(false)
  const [isFullView, setIsFullView] = useState<boolean>(false)
  const [image, setImage] = useState<ImageT | null>(initialImage)
  const [imageSrc, setImageSrc] = useState('')
  const { artists, nextData, prevData, tags } = image || {}
  const title = getImageTitle(image?.title || null)

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      setImagedFinishedLoading(false)
      if (router.isReady) {
        try {
          const idOrSlug = router.asPath?.replace(/\//, '')
          let paramImageVersion = searchParams.get('v') as any
          paramImageVersion = paramImageVersion === 'original'
            ? 'no-border'
            : !paramImageVersion
              ? null
              : paramImageVersion
          const data = await getImage(idOrSlug)
          setImage(data)
          const imageUrl = getAvailableImageUrl(paramImageVersion, data)
          setImageSrc(imageUrl)

        } catch (error: any) {
          if (error?.response?.status === 404) {
            router.replace('/art')
          }
        }
        setIsLoading(false)
      }
    })()
  }, [router.isReady, searchParams])

  function artistLinkOnClick(artist: Artist) {
    artistNavigation(artist)
  }

  function artistLinkOnKeyUp(event: any, artist: Artist) {
    if (event?.key === 'Enter'){
      artistNavigation(artist)
    }
  }

  function artistNavigation(artist: Artist) {
    router.push(`/artist/${artist?.id}`)
  }

  function tagBadgeOnClick(tag: Tag) {
    tagNavigation(tag)
  }

  function tagBadgeOnKeyUp(event: any, tag: Tag) {
    if (event?.key === 'Enter'){
      tagNavigation(tag)
    }
  }

  function tagNavigation(tag: Tag) {
    router.push(`/art?tagId=${tag?.id}`)
  }

  function handleImageClick() {
    setIsFullView(true)
  }

  function handleImageFinishedLoading() {
    setImagedFinishedLoading(true)
  }

  const artistLinks = artists?.map((artist) => {
    const artistName = artist?.name
    return (
      <ArtistLink
        className={styles['artist-link']}
        href={`/artist/${artist.id}`}
        key={`artist-${artistName}`}
        name={artistName}
      />
    )
  })

  const tagBadges = tags?.map((tag) => {
    const tagTitle = tag?.title
    return (
      <TagBadge
        className={styles['tab-badge']}
        onClick={() => tagBadgeOnClick(tag)}
        onKeyUp={(event) => tagBadgeOnKeyUp(event, tag)}
        key={`tag-${tagTitle}`}
        title={tagTitle}
      />
    )
  })

  const prevNav = (
    <Link className={styles['prev-svg']} href={`/${prevData?.slug ? prevData.slug : prevData?.id}`}>
      <FAIcon
        icon={faArrowLeft}
        title='Go to previous image'
      />
    </Link>
  )

  const nextNav = (
    <Link className={styles['next-svg']} href={`/${nextData?.slug ? nextData.slug : nextData?.id}`}>
      <FAIcon
        icon={faArrowRight}
        title='Go to next image'
      />
    </Link>
  )

  const artistNames = artists?.map((artist) => artist?.name)?.join(', ')

  const metaTitle = title
  const metaDescription = `${title} ${artistNames ? `– by ${artistNames}` : ''}`
  const metaImageUrl = getAvailableImageUrl('preview', image)

  return (
    <>
      <Head>
        <title>{`$PAINT - ${title}`}</title>
        <meta name='description' content={metaDescription} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mspaintsol" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImageUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImageUrl} />
        <meta property="og:type" content="website" />
      </Head>
      <FullImageModal
        closeButtonRef={closeButtonRef}
        handleHide={() => setIsFullView(false)}
        imageSrc={imageSrc}
        show={isFullView}
        title={title}
      />
      <div className='container-fluid main-content-column overflow-y-scroll'>
        <div className={`main-content-inner-wrapper ${styles['main-content-inner-wrapper-mobile']}`}>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-2 col-md-1 d-none d-md-block'>
                <div className={styles['prev']}>
                  {prevData?.id && prevNav}
                </div>
              </div>
              <div className='col-lg-8 col-md-10'>
                {isLoading && <LoadingSpinner />}
                {!isLoading && (
                  <>
                    <div className={`${styles['header-top-wrapper']}`}>
                      <h2 className={styles['header-top-title']}>{title}</h2>
                      {/* <div className={styles['header-top-buttons']}>
                        <FAIcon
                          className={styles['header-top-icon']}
                          icon={faEdit}
                          title='Suggest an edit'
                        />
                        <FAIcon
                          className={styles['header-top-icon']}
                          icon={faStar}
                          title='Favorite'
                        />
                      </div> */}
                    </div>
                    {
                      !!artistLinks?.length && (
                        <div className='row'>
                          <div className={`col-md-12 ${styles['artist-link-wrappers']}`}>
                            {artistLinks}
                          </div>
                        </div>
                      )
                    }
                    <div className='row mt-2'>
                      <div className='col-md-8'>
                        {tagBadges}
                      </div>
                      <div className='col-md-4 ml'>
                        <ImageVersionLinks image={image} />
                      </div>
                    </div>
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
                        <div className={styles['main-image-wrapper']}>
                          <Image
                            alt={title}
                            className={`${styles['main-image']}`}
                            imageSrc={imageSrc}
                            onClick={handleImageClick}
                            onLoad={handleImageFinishedLoading}
                            priority
                            stretchFill
                            title={title}
                          />
                        </div>
                      )
                    }
                  </>
                )}
              </div>
              <div className='col-lg-2 col-md-1 d-none d-md-block'>
                <div className={styles['next']}>
                  {nextData?.id && nextNav}
                </div>
              </div>
            </div>
            {
              imagedFinishedLoading && (
                <div className={`d-block d-md-none d-lg-none d-xl-none d-xxl-none ${styles['small-screen-navs']}`}>
                  <div className={styles['prev']}>
                    {prevData?.id && prevNav}
                  </div>
                  <div className={styles['next']}>
                    {nextData?.id && nextNav}
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}
