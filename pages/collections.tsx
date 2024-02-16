import _debounce from 'lodash/debounce'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import CollectionCards from '@/components/CollectionCards'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Collection } from '@/lib/types'
import { getCollections } from '@/services/collection'
import styles from '@/styles/Collections.module.css'

export const getServerSideProps = (async () => { 
  const data = await getCollections({ page: 1 })
  const initialCollections: Collection[] = data?.[0] || []
  const initialCollectionsTotal: number = data?.[1] || 0

  return {
    props: {
      initialCollections,
      initialCollectionsTotal
    }
  }
})

type Props = {
  initialCollections: Collection[]
  initialCollectionsTotal: number | null
}

export default function Collections({
  initialCollections,
  initialCollectionsTotal
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [collections, setCollections] = useState<Collection[]>(initialCollections)
  const [page, setPage] = useState<number>(1)
  const [endReached, setEndReached] = useState<boolean>(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleOnScroll = useCallback(_debounce(handleOnScroll, 500, {
    leading: true,
    trailing: true,
    maxWait: 500
  }), [])

  const metaTitle = '$PAINT - Collections and Sticker Sets'
  const metaDescription = 'Collections and sticker sets by the $PAINT community.'
  const metaImageUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/paint-logo-preview.png`

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
            collections,
            page,
            setPage,
            setCollections
          })
        }}>
        <div className='main-content-inner-wrapper'>
          {
            (!isLoading && initialCollectionsTotal !== null) && (
              <div className={styles['results-found']}>
                {
                  `${initialCollectionsTotal} ${initialCollectionsTotal && initialCollectionsTotal > 1 ? ' collections' : ' collection'}`
                }
              </div>
            )
          }
          <CollectionCards
            collections={collections}
            endReached={endReached}
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
  collections: Collection[]
  page: number
  setPage: any
  setCollections: any
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
  collections,
  page,
  setPage,
  setCollections
}: HandleOnScroll) {
  const element = event.target
  const bottomSpacerHeight = 64
  const endOfElementReached = element.scrollHeight - (element.scrollTop + 1) - bottomSpacerHeight < element.offsetHeight
  if (endOfElementReached && !isLoading && !endReached) {
    setIsLoading(true)
    const oldCollections = collections
    const nextPage = page + 1
    let nextPageData = await getCollections({ page: nextPage })

    if (nextPageData?.[0].length === 0) {
      setEndReached(true)
    }
    const newCollections = [...oldCollections, ...nextPageData?.[0]]
    setPage(nextPage)
    setCollections(newCollections)
  }
  setIsLoading(false)
}
