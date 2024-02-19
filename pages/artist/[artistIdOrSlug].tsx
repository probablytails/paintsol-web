import * as serverSideCookieLib from 'cookie'
import _debounce from 'lodash/debounce'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import clientSideCookieLib from 'universal-cookie'
import ImageCards from '@/components/ImageCards'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Artist, Image, ViewTypes } from '@/lib/types'
import { getArtist, getArtistProfilePictureUrl } from '@/services/artist'
import { getImagesByArtistId } from '@/services/image'
import styles from '@/styles/Artist.module.css'
import ArtistHeader from '@/components/ArtistHeader'
import { checkIfValidInteger } from '@/lib/validation'
import ViewTypeSelector from '@/components/ViewTypeSelector'

type ServerSidePropsParams = {
  artistIdOrSlug?: string
}

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
  const { params, req, res } = context
  const { artistIdOrSlug } = params as ServerSidePropsParams
  const { cookie: cookies } = req.headers
  
  let initialImages: Image[] = []
  let initialImagesTotal: number = 0
  let initialArtist: Artist | null = null
  let shouldRedirect = false

  if (artistIdOrSlug) {
    try {
      const data = await getArtist(artistIdOrSlug, true)
      if (data) {
        initialArtist = data
      }
      const isValidInteger = checkIfValidInteger(artistIdOrSlug)
      if (isValidInteger && initialArtist?.id === parseInt(artistIdOrSlug, 10)
        && initialArtist?.slug) {
        shouldRedirect = true
      }
    } catch (error: any) {
      //
    }
  }

  if (!shouldRedirect && initialArtist) {
    const data = await getImagesByArtistId({ page: 1, artistId: initialArtist.id })
    initialImages = data?.[0] || []
    initialImagesTotal = data?.[1] || 0
  }

  const parsedCookies = cookies ? serverSideCookieLib.parse(cookies) : {}
  const initialViewType: ViewTypes = parsedCookies?.artViewTypeSelected as ViewTypes || 'small'

  return {
    ...(shouldRedirect && !!initialArtist ? {
      redirect: {
        permanent: false,
        destination: `/artist/${initialArtist.slug}/`
      }
    } : {}),
    props: {
      artist: initialArtist,
      initialImages,
      initialImagesTotal,
      initialViewType
    }
  }
})

type Props = {
  artist: Artist
  initialImages: Image[]
  initialImagesTotal: number
  initialViewType: ViewTypes
}

export default function ArtistPage({
  artist,
  initialImages,
  initialImagesTotal,
  initialViewType
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<Image[]>(initialImages)
  const [page, setPage] = useState<number>(1)
  const [endReached, setEndReached] = useState<boolean>(false)
  const [viewTypeSelected, setViewTypeSelected] = useState<ViewTypes>(initialViewType)
  const clientSideCookies = new clientSideCookieLib(null, { path: '/' })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleOnScroll = useCallback(_debounce(handleOnScroll, 500, {
    leading: true,
    trailing: true,
    maxWait: 500
  }), [])

  const handleSelectViewType = (newViewType: ViewTypes) => {
    setViewTypeSelected(newViewType)
    clientSideCookies.set('artViewTypeSelected', newViewType)
  }

  const imageTotalText = `${initialImagesTotal} ${initialImagesTotal === 1 ? 'painting' : 'paintings'}`

  const metaTitle = `$PAINT - ${artist.name}`
  const metaDescription = `Paintings by ${artist.name}`
  const metaImageUrl = artist.has_profile_picture
    ? getArtistProfilePictureUrl(artist.id, 'preview')
    : `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/profile-picture-preview.png`

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
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
      <div
        className='container-fluid main-content-column overflow-y-scroll'
        onScroll={(event) => {
          debouncedHandleOnScroll({
            event,
            setIsLoading,
            setEndReached,
            isLoading,
            endReached,
            images,
            page,
            artist,
            setPage,
            setImages
          })
        }}>
        <div className={`main-content-inner-wrapper ${viewTypeSelected === 'tiny' ? 'main-content-end-may-not-be-reached' : ''}`}>
          <ArtistHeader artist={artist} />
          <div className={`row ${styles['list-header']}`}>
            <div className='d-none d-sm-block col-sm-2'></div>
            <div className='col-sm-8'>
              <div className={styles['results-found']}>
                {imageTotalText}
              </div>
            </div>
            <div className='col-sm-2'>
              <ViewTypeSelector
                handleSelectViewType={handleSelectViewType}
                viewTypeSelected={viewTypeSelected}
              />
            </div>
          </div>
          <ImageCards
            endReached={endReached}
            hideTags
            justifyContentCenter
            images={images}
            viewType={viewTypeSelected}
          />
          {isLoading && <LoadingSpinner />}
          {!isLoading && !endReached && <div className={styles['spacer']} />}
        </div>
      </div>
    </>
  )
}

type HandleOnScroll = {
  event: any
  setIsLoading: any
  setEndReached: any
  isLoading: boolean
  endReached: boolean
  images: Image[]
  artist: Artist
  page: number
  setPage: any
  setImages: any
}

/*
  Use debounce to make sure that the infinite scroll request isn't called
  multiple times at the same time. This should be cleaned up...
*/
async function handleOnScroll({
  event,
  setIsLoading,
  setEndReached,
  isLoading,
  endReached,
  images,
  artist,
  page,
  setPage,
  setImages
}: HandleOnScroll) {
  const element = event.target
  const bottomSpacerHeight = 64
  const endOfElementReached = element.scrollHeight - (element.scrollTop + 1) - bottomSpacerHeight < element.offsetHeight
  if (endOfElementReached && !isLoading && !endReached) {
    setIsLoading(true)
    const oldImages = images
    const nextPage = page + 1
    let nextPageData = []
    nextPageData = await getImagesByArtistId({ page: nextPage, artistId: artist.id })

    if (nextPageData?.[0].length === 0) {
      setEndReached(true)
    }
    const newImages = [...oldImages, ...nextPageData?.[0]]
    setPage(nextPage)
    setImages(newImages)
  }
  setIsLoading(false)
}
