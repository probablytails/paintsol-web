import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from '@/styles/components/NavBar.module.css'
import Icon from "./Icon";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import FAIcon from "./FAIcon";
import { faTelegram } from "@fortawesome/free-brands-svg-icons/faTelegram";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons/faXTwitter";

const navIconSize = 24;

type NavLinkIconProps = {
  imageSrc: string
  title: string
  url: string
}

function NavLinkIcon({ imageSrc, title, url }: NavLinkIconProps) {
  return (
    <li className="nav-item">
      <Link
        aria-label={title}
        className={`nav-link ${styles['nav-link-icon']}`}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
        title={title}>
        <Icon
          height={navIconSize}
          imageSrc={imageSrc}
          title={title}
          width={navIconSize}
        />
      </Link>
    </li>
  )
}

type NavLinkFAIconProps = FontAwesomeIconProps & { url: string }

function NavLinkFAIcon({ color, icon, title, url }: NavLinkFAIconProps) {
  return (
    <li className="nav-item">
      <Link
        aria-label={title}
        className={`nav-link ${styles['nav-link-icon']}`}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
        title={title}>
        <FAIcon
          height={navIconSize}
          icon={icon}
          title={title}
          width={navIconSize}
        />
      </Link>
    </li>
  )
}

export default function NavBar() {
  const pathname = usePathname()

  const isGallery = pathname === '/gallery'
  const isWhitepaper = pathname === '/whitepaper'

  return (
    <nav className={`navbar navbar-expand-sm navbar-light bg-light ${styles.navbar}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <Image
            src="/paint_logo_small_square.png"
            alt="MS $Paint Logo"
            width={48}
            height={48}
            priority
          />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto d-flex flex-grow-1">
            <li className="nav-item">
              <Link
                className={`nav-link ${styles['nav-link-text']} ${isGallery ? 'active' : ''}`}
                {...(isGallery ? { "aria-current": "page" } : {})}
                href="/gallery">
                Gallery
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${styles['nav-link-text']} ${isWhitepaper ? 'active' : ''}`}
                {...(isWhitepaper ? { "aria-current": "page" } : {})}
                href="/whitepaper">
                Whitepaper
              </Link>
            </li>
            <div className="flex-grow-1" />
            <div className={styles['social-links']}>
              <NavLinkIcon
                imageSrc="/external-sites/birdeye.svg"
                title="Birdeye"
                url="https://birdeye.so/token/8x9c5qa4nvakKo5wHPbPa5xvTVMKmS26w4DRpCQLCLk3?chain=solana"
              />
              <NavLinkIcon
                imageSrc="/external-sites/dexscreener.svg"
                title="DEX Screener"
                url="https://dexscreener.com/solana/8x9c5qa4nvakKo5wHPbPa5xvTVMKmS26w4DRpCQLCLk3"
              />
              <NavLinkIcon
                imageSrc="/external-sites/dextools.svg"
                title="DEXTools"
                url="https://www.dextools.io/app/en/solana/pair-explorer/NniGZMgEpXL9jTmEATcKMxUbmH5cSNALngJKAQLTXzB"
              />
              <NavLinkIcon
                imageSrc="/external-sites/coingecko.svg"
                title="CoinGecko"
                url="https://www.coingecko.com/en/coins/ms-paint/usd"
              />
              <NavLinkFAIcon
                icon={faXTwitter}
                title='X - Twitter'
                url='https://twitter.com/MSPaintSOL'
              />
              <NavLinkFAIcon
                icon={faTelegram}
                title='Telegram'
                url='https://t.co/OjMn6rdbaU'
              />
            </div>
          </ul>
        </div>
      </div>
    </nav>
  )
}
