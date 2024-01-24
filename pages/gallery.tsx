import Head from 'next/head'
import ImageCards from '@/components/ImageCards'
import SearchInput from '@/components/SearchInput'
import { getSampleImageData } from '@/lib/sampleData'
import { Dispatch, SetStateAction, useState } from 'react'

export default function Gallery() {
  const [isLoading, setIsLoading] = useState(false)
  const sampleData = getSampleImageData()
  const imageItems = sampleData.imageItems

  return (
    <>
      <Head>
        <title>$PAINT – Gallery</title>
        <meta name='description' content='TODO: GALLERY PAGE DESCRIPTION' />
      </Head>
      <div className='container-fluid my-4'>
        <SearchInput handleSearch={(value: string) => handleSearch(value, setIsLoading)} />
        <ImageCards isLoading={isLoading} items={imageItems} />
      </div>
    </>
  )
}

const handleSearch = (
  value: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  console.log('handleSearch', value)
  setIsLoading(true)
  setTimeout(() => {
    setIsLoading(false)
  }, 3000)
}
