import _debounce from 'lodash/debounce'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import ImageCards from '@/components/ImageCards'
import SearchInput from '@/components/SearchInput'
import { Image, Tag } from '@/lib/types'
import { getImages, getImagesByTagId } from '@/services/image'
import { getAllTags } from '@/services/tag'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Gallery() {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [page, setPage] = useState<number>(1)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [endReached, setEndReached] = useState<boolean>(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleOnScroll = useCallback(_debounce(handleOnScroll, 500), [])

  useEffect(() => {
    (async () => {
      try {
        const images = await getImages({ page })
        setImages(images)
        const allTags = await getAllTags()
        setAllTags(allTags)
      } catch (error) {
        //
      }
    })()
  }, [])

  const handleSearch = async (tag: Tag | null) => {
    setIsLoading(true)
    setPage(1)
    setEndReached(false)
    setSelectedTag(tag)
    if (!tag) {
      const images = await getImages({ page: 1 })
      setImages(images)
    } else {
      const images = await getImagesByTagId({ page: 1, tagId: tag.id })
      setImages(images)
    }
    setIsLoading(false)
  }

  const metaTitle = '$PAINT - Art Gallery'
  const metaDescription = 'The $PAINT on SOL art gallery. Showcasing the art of the $PAINT community.'
  const metaImageUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/paint_splash_logo.png`

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
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
      <div className='container-fluid main-content-column' onScroll={(event) => {
        debouncedHandleOnScroll({
          event,
          setIsLoading,
          setEndReached,
          isLoading,
          endReached,
          images,
          selectedTag,
          page,
          setPage,
          setImages
        })
      }}>
        <div className='main-content-inner-wrapper'>
          <SearchInput
            allTags={allTags}
            handleSearch={(tag: Tag | null) => handleSearch(tag)}/>
          <ImageCards images={images} />
          {isLoading && <LoadingSpinner />}
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
  selectedTag,
  page,
  setPage,
  setImages
}: HandleOnScroll) {
  const element = event.target
  const endOfElementReached = element.scrollHeight - (element.scrollTop + 1) < element.offsetHeight
  if (endOfElementReached && !isLoading && !endReached) {
    setIsLoading(true)
    const oldImages = images
    const nextPage = page + 1
    let nextPageImages = []
    if (selectedTag) {
      nextPageImages = await getImagesByTagId({ page: nextPage, tagId: selectedTag.id })
    } else {
      nextPageImages = await getImages({ page: nextPage })
    }
    if (nextPageImages?.length === 0) {
      setEndReached(true)
    }
    const newImages = [...oldImages, ...nextPageImages]
    setPage(nextPage)
    setImages(newImages)
  }
  setIsLoading(false)
}
