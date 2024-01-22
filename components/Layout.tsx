import { Inter } from "next/font/google";
import Head from "next/head";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>$PAINT</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className={inter.className}>{children}</main>
    </>
  )
}
