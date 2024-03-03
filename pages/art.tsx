import _debounce from 'lodash/debounce'
import Head from 'next/head'
import * as serverSideCookieLib from 'cookie'
import clientSideCookieLib from 'universal-cookie'
import { useCallback, useEffect, useRef, useState } from 'react'
import ImageCards from '@/components/ImageCards'
import SearchInput from '@/components/SearchInput'
import { Artist, FilterTypes, Image, Tag, ViewTypes } from '@/lib/types'
import { getAllArtistsWithImages, getArtist } from '@/services/artist'
import { ImageType, getImages, getImagesByArtistId, getImagesByTagId, getImagesWithoutArtists } from '@/services/image'
import { getAllTagsWithImages, getTagById } from '@/services/tag'
import LoadingSpinner from '@/components/LoadingSpinner'
import styles from '@/styles/Art.module.css'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import FilterSelector from '@/components/FilterSelector'
import { checkIfValidInteger } from '@/lib/validation'
import InfoBox from '@/components/InfoBox'
import { CurationInfoText } from '@/lib/constants/curationInfoText'
import { useSearchParams } from 'next/navigation'

type QueryParamImageType = 'paintings' | 'memes' | null

const getCurrentImageType = (queryParamImageType: QueryParamImageType) => {
  let initialSelectedImageType: ImageType = 'painting-and-meme'
  if (queryParamImageType === 'memes') {
    initialSelectedImageType = 'meme'
  } else if (queryParamImageType === 'paintings') {
    initialSelectedImageType = 'painting'
  }
  return initialSelectedImageType
}

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
  const { query, req } = context
  const { cookie: cookies } = req.headers
  const { artistId, noArtist, tagId, type } = query

  const initialSelectedImageType = getCurrentImageType(type as any)

  let initialFilterSelected = 'by-tag'
  if (artistId || noArtist) {
    initialFilterSelected = 'by-artist'
  }

  const allArtists = await getAllArtistsWithImages()
  const initialAllTags = await getAllTagsWithImages(initialSelectedImageType)

  const artistIdIsValidInteger = checkIfValidInteger(artistId as string)
  const tagIdIsValidInteger = checkIfValidInteger(tagId as string)
  
  let initialImages: Image[] = []
  let initialImagesTotal: number | null = 0

  let initialArtist: Artist | null = null
  let initialTag: Tag | null = null

  let initialInputText = ''

  if (!artistIdIsValidInteger && noArtist) {
    const data = await getImagesWithoutArtists({
      page: 1
    })
    initialImages = data?.[0] || []
    initialImagesTotal = data?.[1] || 0
  } else if (!artistIdIsValidInteger && !tagIdIsValidInteger) {
    const data = await getImages({
      page: 1,
      imageType: initialSelectedImageType
    })
    initialImages = data?.[0] || []
    initialImagesTotal = null
  } else if (artistIdIsValidInteger) {
    const parsedArtistId = parseInt(artistId as string, 10)
    initialArtist = await getArtist(parsedArtistId)
    initialInputText = initialArtist?.name
    const data = await getImagesByArtistId({
      page: 1,
      artistId: initialArtist.id
    })
    initialImages = data?.[0] || []
    initialImagesTotal = data?.[1] || 0
  } else if (tagIdIsValidInteger) {
    const parsedTagId = parseInt(tagId as string, 10)
    initialTag = await getTagById(parsedTagId)
    initialInputText = initialTag?.title
    const data = await getImagesByTagId({
      page: 1,
      tagId: initialTag.id,
      imageType: initialSelectedImageType
    })
    initialImages = data?.[0] || []
    initialImagesTotal = data?.[1] || 0
  }

  const parsedCookies = cookies ? serverSideCookieLib.parse(cookies) : {}
  const initialViewType: ViewTypes = parsedCookies?.artViewTypeSelected as ViewTypes || 'small'

  return {
    props: {
      allArtists,
      initialAllTags,
      initialArtist,
      initialFilterSelected,
      initialImages,
      initialImagesTotal,
      initialInputText,
      initialSelectedImageType,
      initialTag,
      initialViewType,
      noArtist: noArtist || null
    }
  }
})

type Props = {
  allArtists: Artist[]
  initialAllTags: Tag[]
  initialArtist: Artist | null
  initialFilterSelected: FilterTypes
  initialImages: Image[]
  initialImagesTotal: number | null
  initialInputText: string
  initialSelectedImageType: ImageType
  initialTag: Tag | null
  initialViewType: ViewTypes
  noArtist: boolean
}

export default function Gallery({
  allArtists,
  initialAllTags,
  initialArtist,
  initialFilterSelected,
  initialImages,
  initialImagesTotal,
  initialInputText,
  initialSelectedImageType,
  initialTag,
  initialViewType,
  noArtist
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { pathname } = router
  const [allTags, setAllTags] = useState<Tag[]>(initialAllTags)
  const [endReached, setEndReached] = useState<boolean>(false)
  const [filterSelected, setFilterSelected] = useState<FilterTypes>(initialFilterSelected)
  const [isLoading, setIsLoading] = useState(false)
  const [inputText, setInputText] = useState(initialInputText)
  const [images, setImages] = useState<Image[]>(initialImages)
  const [imagesTotal, setImagesTotal] = useState<number | null>(initialImagesTotal)
  const [page, setPage] = useState<number>(1)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(initialArtist)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(initialTag)
  const [viewTypeSelected, setViewTypeSelected] = useState<ViewTypes>(initialViewType)
  const clientSideCookies = new clientSideCookieLib(null, { path: '/' })
  
  const [selectedImageType, setSelectedImageType] = useState<ImageType>(initialSelectedImageType)
  const selectedImageTypeRef = useRef(selectedImageType)
  selectedImageTypeRef.current = selectedImageType

  useEffect(() => {
    (async () => {
      try {
        const newSeachParamType = searchParams.get('type') as QueryParamImageType | null
        const newImageType = getCurrentImageType(newSeachParamType)

        if (newImageType !== selectedImageType) {
          await handleSelectImageType({ target: { value: newImageType }})
        }
      } catch (error) {
        //
      }
    })()
  }, [searchParams])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleOnScroll = useCallback(_debounce(handleOnScroll, 500, {
    leading: true,
    trailing: true,
    maxWait: 500
  }), [])

  const handleSelectImageType = async (event: any) => {
    const newSelectedImageType = event?.target?.value || 'painting-and-meme'
    setSelectedImageType(newSelectedImageType)
    setTimeout(async () => {
      const newAllTags = await getAllTagsWithImages(newSelectedImageType)
      setAllTags(newAllTags)
      await handleSelectFilter(selectedArtist || selectedTag || null, filterSelected)
    }, 100)
  }

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

    const queryParams: any = !selectedArtistOrTag
      ? {}
      : {
        ...(filterSelected === 'by-artist' ? { artistId: selectedArtistOrTag.id } : {}),
        ...(filterSelected === 'by-tag' ? { tagId: selectedArtistOrTag.id } : {})
      }

    if (selectedImageTypeRef.current === 'painting') {
      queryParams.type = 'paintings'
    } else if (selectedImageTypeRef.current === 'meme') {
      queryParams.type = 'memes'
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
    return getImages({
      page: 1,
      imageType: selectedImageTypeRef.current
    })
  }

  const handleSelectByArtist = async (artist: Artist) => {
    setSelectedArtist(artist)
    setSelectedTag(null)
    setInputText(artist.name)
    return getImagesByArtistId({
      page: 1,
      artistId: artist.id
    })
  }

  const handleSelectByTag = async (tag: Tag) => {
    setSelectedArtist(null)
    setSelectedTag(tag)
    setInputText(tag.title)
    return getImagesByTagId({
      page: 1,
      tagId: tag.id,
      imageType: selectedImageTypeRef.current
    })
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
            setImages,
            noArtist,
            selectedImageType
          })
        }}>
        <div className={`main-content-inner-wrapper ${viewTypeSelected === 'tiny' ? 'main-content-end-may-not-be-reached' : ''}`}>
          <SearchInput
            allArtists={allArtists}
            allTags={allTags}
            filterSelected={filterSelected}
            // TODO: remove duck typing
            handleSelect={handleSelectFilter}
            inputText={inputText}
            setInputText={setInputText}/>
          <div className={styles['filters-wrapper']}>
            <FilterSelector
              filterSelected={filterSelected}
              handleSelectFilter={(newFilterSelected: FilterTypes) => handleSelectFilter(null, newFilterSelected)}
              handleSelectImageType={(newImageType: ImageType) => handleSelectImageType(newImageType)}
              handleSelectViewType={(newViewType: ViewTypes) => handleSelectViewType(newViewType)}
              imageTypeSelected={selectedImageType}
              viewTypeSelected={viewTypeSelected}
            />
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
          {
            noArtist && !selectedArtist && !selectedTag && (
              <InfoBox>
                <CurationInfoText />
              </InfoBox>
            )
          }
          <ImageCards
            endReached={endReached}
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
  selectedArtist: Artist | null
  selectedTag: Tag | null
  page: number
  setPage: any
  setImages: any
  noArtist: boolean
  selectedImageType: ImageType
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
  noArtist,
  selectedArtist,
  selectedTag,
  page,
  setPage,
  setImages,
  selectedImageType
}: HandleOnScroll) {
  const element = event.target
  const bottomSpacerHeight = 64
  const endOfElementReached = element.scrollHeight - (element.scrollTop + 1) - bottomSpacerHeight < element.offsetHeight
  if (endOfElementReached && !isLoading && !endReached) {
    setIsLoading(true)
    const oldImages = images
    const nextPage = page + 1
    let nextPageData = []

    if (noArtist && !selectedArtist) {
      nextPageData = await getImagesWithoutArtists({ page: nextPage })
    } else if (selectedArtist) {
      nextPageData = await getImagesByArtistId({ page: nextPage, artistId: selectedArtist.id })
    } else if (selectedTag) {
      nextPageData = await getImagesByTagId({ page: nextPage, tagId: selectedTag.id, imageType: selectedImageType })
    } else {
      nextPageData = await getImages({ page: nextPage, imageType: selectedImageType })
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
