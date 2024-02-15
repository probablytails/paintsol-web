import Head from 'next/head'
import Footer from '@/components/Footer'
import { useState } from 'react'
import Link from 'next/link'

export default function Roadmap() {
  const [imageIsLoading, setImageIsLoading] = useState(true)

  const handleImageOnLoad = () => {
    setImageIsLoading(!imageIsLoading)
  }

  const metaTitle = '$PAINT - Resources'
  const metaDescription = 'Resources for $PAINT on SOL.'
  const metaImageUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/public/paint-logo-preview.png`
 
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
      <div className='container-fluid main-content-column'>
        <div className='main-content-inner-wrapper center-text'>
          <h3>Telegram Stickers</h3>
          <p>
            <Link
              className='link-primary'
              href='https://t.me/addstickers/PAINTmojiPACK'
              target='_blank'>
              $PAINT-mojis
            </Link>
          </p>
          <p>
            <Link
              className='link-primary'
              href='https://t.me/addstickers/TICKERISPAINT'
              target='_blank'>
              $PAINT Set #1
            </Link>
          </p>
          <p>
            <Link
              className='link-primary'
              href='https://t.me/addstickers/TICKERISPAINT2'
              target='_blank'>
              $PAINT Set #2
            </Link>
          </p>
          <p>
            <Link
              className='link-primary'
              href='https://t.me/addstickers/TICKERISPAINT3'
              target='_blank'>
              $PAINT Set #3
            </Link>
          </p>
          <p>
            <Link
              className='link-primary'
              href='https://t.me/addstickers/TICKERISPAINT4'
              target='_blank'>
              $PAINT Set #4
            </Link>
          </p>
          <p>
            <Link
              className='link-primary'
              href='https://t.me/addstickers/TICKERISPAINT5'
              target='_blank'>
              $PAINT Set #5
            </Link>
          </p>
          <p>
            <Link
              className='link-primary'
              href='https://t.me/addstickers/AnnoyingPaintPack'
              target='_blank'>
              Annoying $PAINT Pack
            </Link>
          </p>
          <p>
            <Link
              className='link-primary'
              href='https://t.me/addstickers/PAINTHASLEGS'
              target='_blank'>
              $PAINT Has Legs
            </Link>
          </p>
        </div>
        {!imageIsLoading && <Footer />}
      </div>
    </>
  )
}
