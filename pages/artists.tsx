import _debounce from 'lodash/debounce'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import ArtistCards from '@/components/ArtistCards'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Artist } from '@/lib/types'
import { getArtists } from '@/services/artist'
import styles from '@/styles/Artists.module.css'

export const getServerSideProps = (async () => { 
  const data = await getArtists({ page: 1 })
  const initialArtists: Artist[] = data || []

  return {
    props: {
      initialArtists
    }
  }
})

type Props = {
  initialArtists: Artist[]
}

export default function Artists({
  initialArtists
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [artists, setArtists] = useState<Artist[]>(initialArtists)
  const [page, setPage] = useState<number>(1)
  const [endReached, setEndReached] = useState<boolean>(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleOnScroll = useCallback(_debounce(handleOnScroll, 500, {
    leading: true,
    trailing: true,
    maxWait: 500
  }), [])

  const metaTitle = '$PAINT - Artists'
  const metaDescription = 'The $PAINT community artists page.'
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
            artists,
            page,
            setPage,
            setArtists
          })
        }}>
        <div className='main-content-inner-wrapper'>
          <ArtistCards
            artists={artists}
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
  artists: Artist[]
  page: number
  setPage: any
  setArtists: any
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
  artists,
  page,
  setPage,
  setArtists
}: HandleOnScroll) {
  const element = event.target
  const bottomSpacerHeight = 64
  const endOfElementReached = element.scrollHeight - (element.scrollTop + 1) - bottomSpacerHeight < element.offsetHeight
  if (endOfElementReached && !isLoading && !endReached) {
    setIsLoading(true)
    const oldArtists = artists
    const nextPage = page + 1
    let nextPageData = await getArtists({ page: nextPage })
    if (nextPageData.length === 0) {
      setEndReached(true)
    }
    const newArtists = [...oldArtists, ...nextPageData]
    setPage(nextPage)
    setArtists(newArtists)
  }
  setIsLoading(false)
}
