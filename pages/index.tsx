import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import Image from '@/components/Image'
import Footer from '@/components/Footer'
import { getImagesCountMaterializedView } from '@/services/imageCountMaterializedView'

export const getServerSideProps = (async () => {
  let imagesCount = 0
  try {
    const data = await getImagesCountMaterializedView()
    imagesCount = data.image_count || 0
  } catch (error) {
    //
  }
  return {
    props: {
      imagesCount: imagesCount
    }
  }
})

type Props = {
  imagesCount: number
}

export default function Home({ imagesCount }: Props) {  
  return (
    <>
      <Head>
        <title>$PAINT</title>
        <meta name='description' content='$PAINT on SOL' />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MSPaintSOL" />
        <meta name="twitter:title" content="$PAINT" />
        <meta name="twitter:description" content="$PAINT on SOL" />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/paint_splash_logo.png`} />
        <meta property="og:title" content="$PAINT" />
        <meta property="og:description" content="$PAINT on SOL" />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/paint_splash_logo.png`} />
        <meta property="og:type" content="website" />
      </Head>
      <div className='centered-column-grid'>
        <div className={styles['content-wrapper']}>
          <Image
            alt='$PAINT Logo'
            className={styles['splash-logo']}
            imageSrc='/paint_splash_logo.png'
            priority
            stretchFill
            title='$PAINT Logo'
          />
          <div className={styles['images-count-wrapper']}>
            <span className={styles['images-count']}>{imagesCount}</span><span>&nbsp;paintings and counting...</span>
          </div>
          <div className={styles['gallery-link-wrapper']}>
            <Link
              className={`link-primary ${styles['gallery-link']}`}
              href='/gallery'>
              Visit the Art Gallery
            </Link>
          </div>
          <div className={styles['contract-wrapper']}>
            <h2 className={styles['contract-label']}>CONTRACT:</h2>
            <h2 className={styles['contract-address']}>8x9c5qa4nvakKo5wHPbPa5xvTVMKmS26w4DRpCQLCLk3</h2>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
