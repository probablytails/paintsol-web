import Head from 'next/head'
import styles from '@/styles/Admin.module.css'

export default function Admin() {
  return (
    <>
      <Head>
        <title>$PAINT – Admin</title>
        <meta name='description' content='TODO: ADMIN PAGE DESCRIPTION' />
      </Head>
      <div className='centered-column-grid'>
        <div className='row mb-5 text-center'>
          <h3>Admin Panel</h3>
          <button
            className={`btn btn-primary ${styles['login-btn']}`}
            onClick={handleLogin}
            type='button'>
            Log In
          </button>
        </div>
      </div>
    </>
  )
}

const handleLogin = () => {
  localStorage.setItem('loginAttempted', 'true')
  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`
}
