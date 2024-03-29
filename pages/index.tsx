import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import Image from '@/components/Image'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const splashLogoClass = isLoading ? styles['splash-logo-is-loading'] : styles['splash-logo']
  const metaImageUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/paint-logo-preview.png`

  return (
    <>
      <Head>
        <title>$PAINT</title>
        <meta name='description' content='$PAINT on SOL' />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mspaintsol" />
        <meta name="twitter:title" content="$PAINT" />
        <meta name="twitter:description" content="$PAINT on SOL" />
        <meta name="twitter:image" content={metaImageUrl} />
        <meta property="og:title" content="$PAINT" />
        <meta property="og:description" content="$PAINT on SOL" />
        <meta property="og:image" content={metaImageUrl} />
        <meta property="og:type" content="website" />
      </Head>
      <div className='centered-column-grid'>
        <div className={styles['content-wrapper']}>
          <Link
            className='link-primary'
            href='/art'>
            <Image
              alt='$PAINT Logo'
              className={splashLogoClass}
              imageSrc='/paint-splash-logo.png'
              onLoad={() => setIsLoading(false)}
              priority
              stretchFill
              title='$PAINT Logo'
            />
          </Link>
          {
            !isLoading && (
              <>
                <div className={styles['art-link-wrapper']}>
                  <Link
                    className={`link-primary ${styles['art-link']}`}
                    href='/art'>
                    Visit the Art Gallery
                  </Link>
                </div>
                <div className={styles['contract-wrapper']}>
                  <h2 className={styles['contract-label']}>CONTRACT:</h2>
                  <h2 className={styles['contract-address']}>8x9c5qa4nvakKo5wHPbPa5xvTVMKmS26w4DRpCQLCLk3</h2>
                </div>
              </>
            )
          }
        </div>
        {
          !isLoading && (
            <Footer />
          )
        }
      </div>
    </>
  )
}
