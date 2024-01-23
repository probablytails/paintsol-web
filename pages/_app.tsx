import 'bootstrap/dist/css/bootstrap.css';
import '@/styles/globals.css';
import "@fortawesome/fontawesome-svg-core/styles.css"
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import('bootstrap');
  }, []);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
