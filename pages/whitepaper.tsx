import Head from 'next/head'
import Image from '@/components/Image'
import styles from '@/styles/Whitepaper.module.css'
import Footer from '@/components/Footer'

export default function Whitepaper() {
  const metaTitle = '$PAINT - Whitepaper'
  const metaDescription = 'The $PAINT on SOL whitepaper.'
  const metaImageUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/public/whitepaper.jpg`

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
        <div className='row mx-2 my-5'>
          <Image
            alt={'$Paint Whitepaper (it\'s an old picture of Paint open with a blank canvas)'}
            className={styles['whitepaper-image']}
            imageSrc='/whitepaper.jpg'
            priority
            stretchFill
            title='Whitepaper'
          />
        </div>
        <Footer />
      </div>
    </>
  )
}
