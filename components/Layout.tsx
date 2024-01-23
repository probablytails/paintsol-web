import Head from "next/head";
import NavBar from "@/components/NavBar";

type Props = {
  children: React.ReactNode
}

/*
  NOTE: Layout styles must go in the globals.css file because *.module.css
  files are not available in _app.tsx (I think).
*/

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>$PAINT</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main>
        {children}
      </main>
    </>
  )
}
