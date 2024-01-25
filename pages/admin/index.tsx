import Head from 'next/head'
import styles from '@/styles/Admin.module.css'
import { UserInfo } from '@/lib/types'
import Link from 'next/link'

type Props = {
  userInfo: UserInfo
}

export default function Admin({ userInfo }: Props) {
  return (
    <>
      <Head>
        <title>$PAINT – Admin</title>
        <meta name='description' content='TODO: ADMIN PAGE DESCRIPTION' />
      </Head>
      <div className='centered-column-grid'>
        <div className='row mb-5 text-center'>
          <h3 className={styles['header-text']}>Admin Panel</h3>
          {
            !userInfo && (
              <button
                className={`btn btn-primary ${styles['btn']}`}
                onClick={handleLogin}
                type='button'>
                Log In
              </button>
            )
          }
          {
            userInfo && (
              <>
                <Link
                  className={`btn btn-primary ${styles['btn']}`}
                  href='/admin/upload-image'>
                  Upload Image
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
