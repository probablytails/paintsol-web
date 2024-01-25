import Head from 'next/head'
import ImageCards from '@/components/ImageCards'
import SearchInput from '@/components/SearchInput'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Image } from '@/lib/types'
import { getImages } from '@/services/image'

export default function Gallery() {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    (async () => {
      const data = await getImages()
      setImages(data)
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
          <SearchInput handleSearch={(value: string) => handleSearch(value, setIsLoading)} />
          <ImageCards
            isLoading={isLoading}
            images={images} />
        </div>
      </div>
    </>
  )
}

const handleSearch = (
  value: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  setIsLoading(true)
  setTimeout(() => {
    setIsLoading(false)
  }, 3000)
}
