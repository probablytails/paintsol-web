import Head from 'next/head'
import ImageCards from '@/components/ImageCards'
import SearchInput from '@/components/SearchInput'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Image, Tag } from '@/lib/types'
import { getImages, getImagesByTagId } from '@/services/image'
import { getAllTags } from '@/services/tag'

export default function Gallery() {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])

  useEffect(() => {
    (async () => {
      const images = await getImages({ page: 1 })
      setImages(images)

      const allTags = await getAllTags()
      setAllTags(allTags)
    })()
  }, [])

  return (
    <>
      <Head>
        <title>$PAINT – Gallery</title>
        <meta name='description' content='TODO: GALLERY PAGE DESCRIPTION' />
      </Head>
      <div className='container-fluid main-content-column'>
        <div className='main-content-inner-wrapper'>
          <SearchInput
            allTags={allTags}
            handleSearch={(tag?: Tag) => handleSearch(setIsLoading, setImages, tag)}/>
          <ImageCards
            isLoading={isLoading}
            images={images} />
        </div>
      </div>
    </>
  )
}

const handleSearch = async (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setImages: Dispatch<SetStateAction<Image[]>>,
  tag?: Tag
) => {
  setIsLoading(true)
  if (!tag) {
    const images = await getImages({ page: 1 })
    setImages(images)
  } else {
    const images = await getImagesByTagId({ page: 1, tagId: tag.id })
    setImages(images)
  }
  setIsLoading(false)
}
