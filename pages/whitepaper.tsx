import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Whitepaper.module.css";

export default function Whitepaper() {
  return (
    <>
      <Head>
        <title>$PAINT – Whitepaper</title>
        <meta name="description" content="TODO: WHITEPAPER PAGE DESCRIPTION" />
      </Head>
      <div className="container">
        <div className="row my-5">
          <Image
            unoptimized
            className={styles['whitepaper-image']}
            src="/whitepaper.jpg"
            width={0}
            height={0}
            sizes=""
            alt="$Paint Whitepaper (it's an old picture of MS Paint open with a blank canvas)"
            style={{ width: '100%', height: 'auto' }}
            priority
          />
        </div>
      </div>
    </>
  );
}
