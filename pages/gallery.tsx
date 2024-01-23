import Head from "next/head";
import ImageCards from "@/components/ImageCards";
import { getSampleImageData } from "@/lib/sampleData";

export default function Gallery() {
  const sampleData = getSampleImageData()
  const imageItems = sampleData.imageItems

  return (
    <>
      <Head>
        <title>$PAINT – Gallery</title>
        <meta name="description" content="TODO: GALLERY PAGE DESCRIPTION" />
      </Head>
      <div className="container-fluid">
        <ImageCards items={imageItems} />
      </div>
    </>
  );
}
