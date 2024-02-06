import _debounce from 'lodash/debounce'
import Head from 'next/head'
import * as serverSideCookieLib from 'cookie'
import clientSideCookieLib from 'universal-cookie'
import { useCallback, useEffect, useState } from 'react'
import ImageCards from '@/components/ImageCards'
import SearchInput from '@/components/SearchInput'
import { Artist, FilterTypes, Image, Tag, ViewTypes } from '@/lib/types'
import { getAllArtistsWithImages, getArtistById } from '@/services/artist'
import { getImages, getImagesByArtistId, getImagesByTagId } from '@/services/image'
import { getAllTagsWithImages, getTagById } from '@/services/tag'
import LoadingSpinner from '@/components/LoadingSpinner'
import styles from '@/styles/Art.module.css'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import FilterSelector from '@/components/FilterSelector'

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
  const { query, req } = context
  const { cookie: cookies } = req.headers
  const { artistId, tagId } = query
  let initialFilterSelected = 'by-tag'
  if (artistId) {
    initialFilterSelected = 'by-artist'
  }

  const allArtists = await getAllArtistsWithImages()
  const allTags = await getAllTagsWithImages()

  const parsedArtistId = parseInt(artistId as any)
  const parsedTagId = parseInt(tagId as any)
  
  let initialImages: Image[] = []
  let initialImagesTotal: number | null = 0

  let initialArtist: Artist | null = null
  let initialTag: Tag | null = null

  let initialInputText = ''

  if (!parsedArtistId && !parsedTagId) {
    const data = await getImages({ page: 1 })
    initialImages = data?.[0] || []
    initialImagesTotal = null
  } else if (parsedArtistId) {
    initialArtist = await getArtistById(parsedArtistId)
    initialInputText = initialArtist?.name
    const data = await getImagesByArtistId({ page: 1, artistId: initialArtist.id })
    initialImages = data?.[0] || []
    initialImagesTotal = data?.[1] || 0
  } else if (tagId) {
    initialTag = await getTagById(parsedTagId)
    initialInputText = initialTag?.title
    const data = await getImagesByTagId({ page: 1, tagId: initialTag.id })
    initialImages = data?.[0] || []
    initialImagesTotal = data?.[1] || 0
  }

  const parsedCookies = cookies ? serverSideCookieLib.parse(cookies) : {}
  const initialViewType: ViewTypes = parsedCookies?.artViewTypeSelected as ViewTypes || 'small'

  return {
    props: {
      allArtists,
      allTags,
      initialArtist,
      initialFilterSelected,
      initialImages,
      initialImagesTotal,
      initialInputText,
      initialTag,
      initialViewType
    }
  }
})

type Props = {
  allArtists: Artist[]
  allTags: Tag[]
  initialArtist: Artist | null
  initialFilterSelected: FilterTypes
  initialImages: Image[]
  initialImagesTotal: number | null
  initialInputText: string
  initialTag: Tag | null
  initialViewType: ViewTypes
}

export default function Gallery({
  allArtists,
  allTags,
  initialArtist,
  initialFilterSelected,
  initialImages,
  initialImagesTotal,
  initialInputText,
  initialTag,
  initialViewType
}: Props) {
  const router = useRouter()
  const { pathname } = router
  const [isLoading, setIsLoading] = useState(false)
  const [inputText, setInputText] = useState(initialInputText)
  const [filterSelected, setFilterSelected] = useState<FilterTypes>(initialFilterSelected)
  const [images, setImages] = useState<Image[]>(initialImages)
  const [imagesTotal, setImagesTotal] = useState<number | null>(initialImagesTotal)
  const [page, setPage] = useState<number>(1)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(initialArtist)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(initialTag)
  const [endReached, setEndReached] = useState<boolean>(false)
  const [viewTypeSelected, setViewTypeSelected] = useState<ViewTypes>(initialViewType)
  const clientSideCookies = new clientSideCookieLib(null, { path: '/' })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleOnScroll = useCallback(_debounce(handleOnScroll, 500, {
    leading: true,
    trailing: true,
    maxWait: 500
  }), [])

  // TODO: replace any with Artist | Tag (probably need a HOC here)
  const handleSelectFilter = async (
    selectedArtistOrTag: Artist | Tag | null,
    filterSelected: FilterTypes
  ) => {
    setIsLoading(true)
    setPage(1)
    setEndReached(false)
    setFilterSelected(filterSelected)
    let data: [Image[], number] = [[], 0]
    if (!selectedArtistOrTag) {
      data = await handleSelectDefault()
      setImagesTotal(null)
    } else if (filterSelected === 'by-artist') {
      data = await handleSelectByArtist(selectedArtistOrTag as Artist)
      setImagesTotal(data?.[1] || 0)
    } else if (filterSelected === 'by-tag') {
      data = await handleSelectByTag(selectedArtistOrTag as Tag)
      setImagesTotal(data?.[1] || 0)
    }
    
    setImages(data?.[0] || [])
    setIsLoading(false)

    const queryParams = !selectedArtistOrTag
      ? {}
      : {
        ...(filterSelected === 'by-artist' ? { artistId: selectedArtistOrTag.id } : {}),
        ...(filterSelected === 'by-tag' ? { tagId: selectedArtistOrTag.id } : {})
      }

    router.push({
      pathname,
      query: queryParams
    })
  }

  const handleSelectViewType = (newViewType: ViewTypes) => {
    setViewTypeSelected(newViewType)
    clientSideCookies.set('artViewTypeSelected', newViewType)
  }

  const handleSelectDefault = async () => {
    setInputText('')
    setSelectedArtist(null)
    setSelectedTag(null)
    return getImages({ page: 1 })
  }

  const handleSelectByArtist = async (artist: Artist) => {
    setSelectedArtist(artist)
    setSelectedTag(null)
    setInputText(artist.name)
    return getImagesByArtistId({ page: 1, artistId: artist.id })
  }

  const handleSelectByTag = async (tag: Tag) => {
    setSelectedArtist(null)
    setSelectedTag(tag)
    setInputText(tag.title)
    return getImagesByTagId({ page: 1, tagId: tag.id })
  }

  const metaTitle = '$PAINT - Art Gallery'
  const metaDescription = 'The $PAINT on SOL art gallery. Showcasing the art of the $PAINT community.'
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
            images,
            page,
            selectedArtist,
            selectedTag,
            setPage,
            setImages
          })
        }}>
        <div className='main-content-inner-wrapper'>
          <SearchInput
            allArtists={allArtists}
            allTags={allTags}
            filterSelected={filterSelected}
            // TODO: remove duck typing
            handleSelect={handleSelectFilter}
            inputText={inputText}
            setInputText={setInputText}/>
          <FilterSelector
            filterSelected={filterSelected}
            handleSelectFilter={(newFilterSelected: FilterTypes) => handleSelectFilter(null, newFilterSelected)}
            handleSelectViewType={(newViewType: ViewTypes) => handleSelectViewType(newViewType)}
            viewTypeSelected={viewTypeSelected}
          />
          {
            (!isLoading && imagesTotal !== null) && (
              <div className={styles['results-found']}>
                {
                  `${imagesTotal} ${imagesTotal && imagesTotal > 1 ? ' paintings' : ' painting'}`
                }
              </div>
            )
          }
          <ImageCards
            endReached={endReached}
            images={images}
            viewType={viewTypeSelected}
          />
          {isLoading && <LoadingSpinner noMargin />}
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
  selectedArtist: Artist | null
  selectedTag: Tag | null
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
  selectedArtist,
  selectedTag,
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

    if (selectedArtist) {
      nextPageData = await getImagesByArtistId({ page: nextPage, artistId: selectedArtist.id })
    } else if (selectedTag) {
      nextPageData = await getImagesByTagId({ page: nextPage, tagId: selectedTag.id })
    } else {
      nextPageData = await getImages({ page: nextPage })
    }
    if (nextPageData?.[0].length === 0) {
      setEndReached(true)
    }
    const newImages = [...oldImages, ...nextPageData?.[0]]
    setPage(nextPage)
    setImages(newImages)
  }
  setIsLoading(false)
}
