import * as serverSideCookieLib from 'cookie'
import _debounce from 'lodash/debounce'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import clientSideCookieLib from 'universal-cookie'
import CollectionHeader from '@/components/CollectionHeader'
import ImageCards from '@/components/ImageCards'
import LoadingSpinner from '@/components/LoadingSpinner'
import ViewTypeSelector from '@/components/ViewTypeSelector'
import { Collection, Image, ViewTypes } from '@/lib/types'
import { checkIfValidInteger } from '@/lib/validation'
import { getCollection } from '@/services/collection'
import { getAvailableImageUrl, getImagesByCollectionId } from '@/services/image'
import styles from '@/styles/Collection.module.css'

type ServerSidePropsParams = {
  collectionIdOrSlug?: string
}

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
  const { params, req, res } = context
  const { collectionIdOrSlug } = params as ServerSidePropsParams
  const { cookie: cookies } = req.headers
  
  let initialImages: Image[] = []
  let initialImagesTotal: number = 0
  let initialCollection: Collection | null = null
  let shouldRedirect = false

  if (collectionIdOrSlug) {
    try {
      const data = await getCollection(collectionIdOrSlug, true)
      if (data) {
        initialCollection = data
      }
      const isValidInteger = checkIfValidInteger(collectionIdOrSlug)
      if (isValidInteger && initialCollection?.id === parseInt(collectionIdOrSlug, 10)
        && initialCollection?.slug) {
        shouldRedirect = true
      }
    } catch (error: any) {
      //
    }
  }

  if (!shouldRedirect && initialCollection) {
    const data = await getImagesByCollectionId({ page: 1, collection_id: initialCollection.id })
    initialImages = data?.[0] || []
    initialImagesTotal = data?.[1] || 0
  }

  const parsedCookies = cookies ? serverSideCookieLib.parse(cookies) : {}
  const initialViewType: ViewTypes = parsedCookies?.artViewTypeSelected as ViewTypes || 'small'

  return {
    ...(shouldRedirect && !!initialCollection ? {
      redirect: {
        permanent: false,
        destination: `/collection/${initialCollection.slug}/`
      }
    } : {}),
    props: {
      collection: initialCollection,
      initialImages,
      initialImagesTotal,
      initialViewType
    }
  }
})

type Props = {
  collection: Collection
  initialImages: Image[]
  initialImagesTotal: number
  initialViewType: ViewTypes
}

export default function CollectionPage({
  collection,
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

  const imageTotalText = `${initialImagesTotal} ${initialImagesTotal === 1 ? 'sticker' : 'stickers'}`
  
  const collectionFirstPreviewImage = collection?.preview_images?.[0] || null
  
  const metaTitle = `$PAINT - Collection - ${collection.title}`
  const metaDescription = `The ${collection.title} collection on the $PAINT community website.`
  const metaImageUrl = collectionFirstPreviewImage?.image
    ? getAvailableImageUrl('preview', collectionFirstPreviewImage.image)
    : `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/paint-logo-preview.png`

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
            collection,
            setPage,
            setImages
          })
        }}>
        <div className={`main-content-inner-wrapper ${viewTypeSelected === 'tiny' ? 'main-content-end-may-not-be-reached' : ''}`}>
          <CollectionHeader collection={collection} />
          <div className={`row ${styles['list-header']}`}>
            <div className='d-none d-sm-block col-sm-2'></div>
            <div className='col-sm-8'>
              <div className={styles['results-found']}>
                {imageTotalText}
              </div>
            </div>
            <div className='d-none d-sm-block col-sm-2'>
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
  collection: Collection
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
  collection,
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
    nextPageData = await getImagesByCollectionId({ page: nextPage, collection_id: collection.id })

    if (nextPageData?.[0].length === 0) {
      setEndReached(true)
    }
    const newImages = [...oldImages, ...nextPageData?.[0]]
    setPage(nextPage)
    setImages(newImages)
  }
  setIsLoading(false)
}
