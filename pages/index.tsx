import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css"
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>$PAINT</title>
        <meta name="description" content="TODO: HOME PAGE DESCRIPTION" />
      </Head>
      <div className="centered-column-grid">
        <div className={styles['content-wrapper']}>
          <Image
            unoptimized
            className={styles['splash-logo']}
            src="/paint_splash_logo.png"
            width={0}
            height={0}
            alt="$Paint Logo"
            // sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
          <div className={styles['contract-wrapper']}>
            <h2 className={styles['contract-label']}>CONTRACT:</h2>
            <h2 className={styles['contract-address']}>8x9c5qa4nvakKo5wHPbPa5xvTVMKmS26w4DRpCQLCLk3</h2>
          </div>
          <div className={styles['gallery-link-wrapper']}>
            <Link
              className={`link-primary ${styles['gallery-link']}`}
              href="/gallery">
              Visit the Art Gallery
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
