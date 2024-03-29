import Head from 'next/head'
import styles from '@/styles/Admin.module.css'
import { UserInfo } from '@/lib/types'
import Link from 'next/link'

type Props = {
  isUserInfoLoading: boolean
  userInfo: UserInfo
}

export default function Admin({ isUserInfoLoading, userInfo }: Props) {
  return (
    <>
      <Head>
        <title>$PAINT - Admin Panel</title>
        <meta name='description' content='The $PAINT on SOL Admin Panel' />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mspaintsol" />
        <meta name="twitter:title" content="$PAINT" />
        <meta name="twitter:description" content="$PAINT on SOL" />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/paint-logo-preview.png`} />
        <meta property="og:title" content="$PAINT" />
        <meta property="og:description" content="$PAINT on SOL" />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/paint-logo-preview.png`} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex" />
      </Head>
      <div className='centered-column-grid'>
        <div className='row mb-5 flex-column text-center'>
          <h3 className={styles['header-text']}>Admin Panel</h3>
          {
            !userInfo && !isUserInfoLoading && (
              <button
                className={`btn btn-primary ${styles['btn']}`}
                onClick={handleLogin}
                type='button'>
                Log In
              </button>
            )
          }
          {
            (userInfo || !!isUserInfoLoading) && (
              <>
                <Link
                  className={`btn btn-success ${styles['btn']}`}
                  href='/admin/upload-image'>
                  Upload Image
                </Link>
                <Link
                  className={`btn btn-primary ${styles['btn']}`}
                  href='/admin/update-artist'>
                  Update Artist
                </Link>
                <Link
                  className={`btn btn-outline-success ${styles['btn']}`}
                  href='/admin/collection'>
                  Create Collection
                </Link>
                <button
                  className={`btn btn-warning ${styles['btn']}`}
                  onClick={handleLogout}
                  type='button'>
                  Log Out
                </button>
              </>
            )
          }
        </div>
      </div>
    </>
  )
}

const handleLogin = () => {
  localStorage.setItem('loginAttempted', 'true')
  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`
}

const handleLogout = () => {
  localStorage.setItem('loginAttempted', 'true')
  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`
}
