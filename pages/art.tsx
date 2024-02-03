import _debounce from 'lodash/debounce'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import ImageCards from '@/components/ImageCards'
import SearchInput from '@/components/SearchInput'
import { Artist, Image, Tag } from '@/lib/types'
import { getAllArtistsWithImages, getArtistById } from '@/services/artist'
import { getImages, getImagesByArtistId, getImagesByTagId } from '@/services/image'
import { getAllTagsWithImages, getTagById } from '@/services/tag'
import LoadingSpinner from '@/components/LoadingSpinner'
import styles from '@/styles/Art.module.css'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
  const { query } = context
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

  return {
    props: {
      allArtists,
      allTags,
      initialArtist,
      initialFilterSelected,
      initialImages,
      initialImagesTotal,
      initialInputText,
      initialTag
    }
  }
})

type Props = {
  allArtists: Artist[]
  allTags: Tag[]
  initialArtist: Artist | null
  initialFilterSelected: 'by-artist' | 'by-tag'
  initialImages: Image[]
  initialImagesTotal: number | null
  initialInputText: string
  initialTag: Tag | null
}

export default function Gallery({
  allArtists,
  allTags,
  initialArtist,
  initialFilterSelected,
  initialImages,
  initialImagesTotal,
  initialInputText,
  initialTag
}: Props) {
  const router = useRouter()
  const { pathname } = router
  const [isLoading, setIsLoading] = useState(false)
  const [inputText, setInputText] = useState(initialInputText)
  const [filterSelected, setFilterSelected] = useState<'by-artist' | 'by-tag'>(initialFilterSelected)
  const [images, setImages] = useState<Image[]>(initialImages)
  const [imagesTotal, setImagesTotal] = useState<number | null>(initialImagesTotal)
  const [page, setPage] = useState<number>(1)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(initialArtist)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(initialTag)
  const [endReached, setEndReached] = useState<boolean>(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleOnScroll = useCallback(_debounce(handleOnScroll, 500, {
    leading: true,
    trailing: true,
    maxWait: 500
  }), [])

  // TODO: replace any with Artist | Tag (probably need a HOC here)
  const handleSearch = async (
    selectedArtistOrTag: Artist | Tag | null,
    filterSelected: 'by-artist' | 'by-tag'
  ) => {
    setIsLoading(true)
    setPage(1)
    setEndReached(false)
    setFilterSelected(filterSelected)
    let data: [Image[], number] = [[], 0]
    if (!selectedArtistOrTag) {
      data = await handleSearchDefault()
      setImagesTotal(null)
    } else if (filterSelected === 'by-artist') {
      data = await handleSearchByArtist(selectedArtistOrTag as Artist)
      setImagesTotal(data?.[1] || 0)
    } else if (filterSelected === 'by-tag') {
      data = await handleSearchByTag(selectedArtistOrTag as Tag)
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

  const handleSearchDefault = async () => {
    setInputText('')
    setSelectedArtist(null)
    setSelectedTag(null)
    return getImages({ page: 1 })
  }

  const handleSearchByArtist = async (artist: Artist) => {
    setSelectedArtist(artist)
    setSelectedTag(null)
    setInputText(artist.name)
    return getImagesByArtistId({ page: 1, artistId: artist.id })
  }

  const handleSearchByTag = async (tag: Tag) => {
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
        <meta name="twitter:site" content="@paintonsol" />
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
            handleSearch={handleSearch}
            inputText={inputText}
            setInputText={setInputText}/>
          <div className={styles['filter-selector-wrapper']}>
            <div className={`form-check ${styles['filter-radio-wrapper']}`}>
              <input
                checked={filterSelected === 'by-tag'}
                className="form-check-input"
                id="radioFilterSelectedTag"
                name="radioFilterSelected"
                onChange={() => handleSearch(null, 'by-tag')}
                type="radio"
              />
              <label className="form-check-label" htmlFor="radioFilterSelectedTag">
                Tag
              </label>
            </div>
            <div className={`form-check ${styles['filter-radio-wrapper']}`}>
              <input
                checked={filterSelected === 'by-artist'}
                className="form-check-input"
                id="radioFilterSelectedArtist"
                name="radioFilterSelected"
                onChange={() => handleSearch(null, 'by-artist')}
                type="radio"
              />
              <label className="form-check-label" htmlFor="radioFilterSelectedArtist">
                Artist
              </label>
            </div>
          </div>

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
            images={images}
            endReached={endReached} />
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
