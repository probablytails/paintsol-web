import Head from 'next/head'
import styles from '@/styles/Roadmap.module.css'
import Image from '@/components/Image'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function Roadmap() {
  const [imageIsLoading, setImageIsLoading] = useState(true)

  const handleImageOnLoad = () => {
    setImageIsLoading(!imageIsLoading)
  }

  const metaTitle = '$PAINT - Roadmap'
  const metaDescription = 'The $PAINT on SOL roadmap.'
  const metaImageUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/public/roadmap.png`
 
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
      <div className='container-fluid main-content-column'>
        <div className='main-content-inner-wrapper'>
          <div className={styles['roadmap-image-wrapper']}>
            <Image
              alt='$PAINT on SOL roadmap'
              className={styles['roadmap-image']}
              imageSrc='/roadmap.png'
              onLoad={handleImageOnLoad}
              priority
              stretchFill
              title='$PAINT on SOL roadmap'
            />
          </div>
        </div>
        {!imageIsLoading && <Footer />}
      </div>
    </>
  )
}
