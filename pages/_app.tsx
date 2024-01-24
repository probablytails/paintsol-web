import 'bootstrap/dist/css/bootstrap.css'
import '@/styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css"
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import { getUserInfo } from '@/services/admin'

type UserInfo = {
  nickname?: string
  picture?: string
} | null

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo>(null)

  useEffect(() => {
    import('bootstrap')
  }, [])

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('loginAttempted')) {
        const data = await getUserInfo()
        setUserInfo(data)
      }
    })()
  }, [router.asPath])

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
