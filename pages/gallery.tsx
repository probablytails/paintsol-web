import _debounce from 'lodash/debounce'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import ImageCards from '@/components/ImageCards'
import SearchInput from '@/components/SearchInput'
import { Image, Tag } from '@/lib/types'
import { getImages, getImagesByTagId } from '@/services/image'
import { getAllTagsWithImages, getTagById } from '@/services/tag'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useSearchParams } from 'next/navigation'
import styles from '@/styles/Gallery.module.css'

export default function Gallery() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [inputText, setInputText] = useState('')
  const [images, setImages] = useState<Image[]>([])
  const [imagesTotal, setImagesTotal] = useState<number | null>()
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [page, setPage] = useState<number>(1)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [endReached, setEndReached] = useState<boolean>(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleOnScroll = useCallback(_debounce(handleOnScroll, 500), [])

  useEffect(() => {
    (async () => {
      try {
        const tagId = searchParams.get('tagId') || ''
        const parsedTagId = parseInt(tagId)
        const allTags = await getAllTagsWithImages()
        setAllTags(allTags)
        if (parsedTagId > 0) {
          const tag = await getTagById(parsedTagId)
          await handleSearch(tag)
        } else {
          await handleSearch(null)
        }
      } catch (error) {
        //
      }
    })()
  }, [searchParams])

  const handleSearch = async (tag: Tag | null) => {
    setIsLoading(true)
    setPage(1)
    setEndReached(false)
    setSelectedTag(tag)
    if (!tag) {
      const data = await getImages({ page: 1 })
      setImages(data?.[0] || [])
      setImagesTotal(data?.[1] || 0)
    } else {
      setInputText(tag.title)
      const data = await getImagesByTagId({ page: 1, tagId: tag.id })
      setImages(data?.[0] || [])
      setImagesTotal(data?.[1] || 0)
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
            handleSearch={(tag: Tag | null) => handleSearch(tag)}
            inputText={inputText}
            setInputText={setInputText}/>
          <div className={styles['results-found']}>
            {`${imagesTotal} ${imagesTotal && imagesTotal > 1 ? 'paintings' : 'painting'}`}
          </div>
          <ImageCards
            images={images}
            endReached={endReached} />
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
    let nextPageData = []
    if (selectedTag) {
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
