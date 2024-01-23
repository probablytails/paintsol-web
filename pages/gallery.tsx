import Head from "next/head";
import FAIcon from "@/components/FAIcon";
import ImageCards from "@/components/ImageCards";
import { getSampleImageData } from "@/lib/sampleData";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import SearchInput from "@/components/SearchInput";

export default function Gallery() {
  const sampleData = getSampleImageData()
  const imageItems = sampleData.imageItems

  return (
    <>
      <Head>
        <title>$PAINT – Gallery</title>
        <meta name="description" content="TODO: GALLERY PAGE DESCRIPTION" />
      </Head>
      <div className="container-fluid my-4">
        <SearchInput />
        <ImageCards items={imageItems} />
      </div>
    </>
  );
}
