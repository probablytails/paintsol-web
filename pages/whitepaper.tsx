import Head from "next/head";
import Image from "@/components/Image";
import styles from "@/styles/Whitepaper.module.css";

export default function Whitepaper() {
  return (
    <>
      <Head>
        <title>$PAINT – Whitepaper</title>
        <meta name="description" content="TODO: WHITEPAPER PAGE DESCRIPTION" />
      </Head>
      <div className="container">
        <div className="row mx-2 my-5">
          <Image
            alt="$Paint Whitepaper (it's an old picture of MS Paint open with a blank canvas)"
            className={styles['whitepaper-image']}
            imageSrc="/whitepaper.jpg"
            priority
            stretchFill
            title="Whitepaper"
          />
        </div>
      </div>
    </>
  );
}
