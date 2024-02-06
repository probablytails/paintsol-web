import Head from 'next/head'
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
        <meta name="twitter:site" content="@mspaintsol" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImageUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImageUrl} />
        <meta property="og:type" content="website" />
      </Head>
      <div>
        <iframe
          className={styles['jspaint-app']}
          src='https://jspaint.app'
        />
        <Footer />
      </div>
    </>
  )
}
