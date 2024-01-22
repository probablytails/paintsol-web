import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

export default function Whitepaper() {
  return (
    <>
      <Head>
        <title>$PAINT – Whitepaper</title>
        <meta name="description" content="TODO: WHITEPAPER PAGE DESCRIPTION" />
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
