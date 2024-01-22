import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

export default function Gallery() {
  return (
    <>
      <Head>
        <title>$PAINT – Gallery</title>
        <meta name="description" content="TODO: GALLERY PAGE DESCRIPTION" />
      </Head>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
    </>
  );
}
