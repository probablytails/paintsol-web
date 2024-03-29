import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import Image from '@/components/Image'
import FAIcon from './FAIcon'
import Icon from './Icon'

import styles from '@/styles/components/NavBar.module.css'
import { useEffect, useRef } from 'react'
import Dropdown, { DropdownItem } from './Dropdown'

const navIconSize = 24

type NavLinkIconProps = {
  className?: string
  imageSrc: string
  title: string
  url: string
}

function NavLinkIcon({ className, imageSrc, title, url }: NavLinkIconProps) {
  return (
    <li className={`nav-item ${className}`}>
      <Link
        aria-label={title}
        className={`nav-link ${styles['nav-link-icon']}`}
        href={url}
        rel='noopener noreferrer'
        target='_blank'
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

function NavLinkFAIcon({ icon, style, title, url }: NavLinkFAIconProps) {
  return (
    <li className='nav-item'>
      <Link
        aria-label={title}
        className={`nav-link ${styles['nav-link-icon']}`}
        href={url}
        rel='noopener noreferrer'
        style={style}
        target='_blank'>
        <FAIcon
          icon={icon}
          title={title}
        />
      </Link>
    </li>
  )
}

type NavDropdownIconProps = {
  imageSrc: string
  title: string
  url: string
}

function NavDropdownIcon({ imageSrc, title, url }: NavDropdownIconProps) {
  return (
    <li>
      <Link
        aria-label={title}
        className={`dropdown-item ${styles['dropdown-item-icon']}`}
        href={url}
        rel='noopener noreferrer'
        target='_target'
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

export default function NavBar() {
  const buttonRef = useRef<any>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryParamType = searchParams.get('type') as any
  const isArtGallery = pathname === '/art' && queryParamType !== 'memes'
  const isArtists = pathname === '/artists'
  const isCollections = pathname === '/collections'
  const isStickers = pathname === '/stickers'
  const isWhitepaper = pathname === '/whitepaper'
  const isRoadmap = pathname === '/roadmap'
  const isMemes = pathname === '/art' && queryParamType === 'memes'

  const handleOutsideClick = (event: any) => {
    const menuIsExpanded = !!document.querySelector('.navbar-collapse.collapse.show')
    if (menuIsExpanded) {
      const btn = document.querySelector('#navbar-button-toggle') as any
      setTimeout(() => {
        btn?.click()
      }, 100)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const dropdownItems: DropdownItem[] = [
    {
      className: `${styles['dropdown-item']} d-md-none`,
      href: '/stickers',
      label: 'Stickers',
      target: '_self'
    },
    {
      className: `${styles['dropdown-item']} d-md-none`,
      href: '/art?type=memes',
      label: 'Memes',
      target: '_self'
    },
    {
      className: `${styles['dropdown-item']} d-lg-none`,
      href: '/whitepaper',
      label: 'Whitepaper',
      target: '_self'
    },
    {
      className: `${styles['dropdown-item']} d-lg-none`,
      href: '/roadmap',
      label: 'Roadmap',
      target: '_self'
    },
    {
      iconRow: (
        <div className={styles['nav-dropdown-icons']} key="nav-dropdown-icons">
          <NavDropdownIcon
            imageSrc='/external-sites/birdeye.svg'
            key='nav-birdeye-icon'
            title='Birdeye'
            url='https://birdeye.so/token/8x9c5qa4nvakKo5wHPbPa5xvTVMKmS26w4DRpCQLCLk3?chain=solana'
          />
          <NavDropdownIcon
            imageSrc='/external-sites/dexscreener.svg'
            key='nav-dexscreener-icon'
            title='DEX Screener'
            url='https://dexscreener.com/solana/8x9c5qa4nvakKo5wHPbPa5xvTVMKmS26w4DRpCQLCLk3'
          />
          <NavDropdownIcon
            imageSrc='/external-sites/dextools.svg'
            key='nav-dextools-icon'
            title='DEXTools'
            url='https://www.dextools.io/app/en/solana/pair-explorer/NniGZMgEpXL9jTmEATcKMxUbmH5cSNALngJKAQLTXzB'
          />
          <NavDropdownIcon
            imageSrc='/external-sites/coingecko.svg'
            key='nav-coingecko-icon'
            title='CoinGecko'
            url='https://www.coingecko.com/en/coins/ms-paint/usd'
          />
        </div>
      )
    }
  ]

  return (
    <nav
      className={`navbar fixed-top navbar-expand-sm navbar-light bg-light ${styles.navbar}`}>
      <div className='container-fluid'>
        <Link className='navbar-brand d-none d-sm-block' href='/'>
          <Image
            alt='$PAINT Logo'
            height={48}
            imageSrc='/paint-logo-small-square.png'
            priority
            title='$PAINT Logo'
            width={48}
          />
        </Link>
        <Link className='navbar-brand d-block d-sm-none' href='/'>
          <Image
            alt='$PAINT Logo'
            height={48}
            imageSrc='/paint-horizontal-logo.png'
            priority
            title='$PAINT Logo'
            width={175}
          />
        </Link>
        <button
          className='navbar-toggler'
          id='navbar-button-toggle'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          ref={buttonRef}>
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto d-flex flex-grow-1'>
            <li className='nav-item'>
              <Link
                className={`nav-link ${styles['nav-link-text']} ${isArtGallery ? 'active' : ''}`}
                {...(isArtGallery ? { 'aria-current': 'page' } : {})}
                href='/art'>
                Gallery
              </Link>
            </li>
            <li className='nav-item d-block d-sm-none d-md-block'>
              <Link
                className={`nav-link ${styles['nav-link-text']} ${isMemes ? 'active' : ''}`}
                {...(isMemes ? { 'aria-current': 'page' } : {})}
                href='/art?type=memes'>
                Memes
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={`nav-link ${styles['nav-link-text']} ${isArtists ? 'active' : ''}`}
                {...(isArtists ? { 'aria-current': 'page' } : {})}
                href='/artists'>
                Artists
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={`nav-link ${styles['nav-link-text']} ${isCollections ? 'active' : ''}`}
                {...(isCollections ? { 'aria-current': 'page' } : {})}
                href='/collections'>
                Collections
              </Link>
            </li>
            <li className='nav-item d-block d-sm-none d-md-block d-lg-block d-xl-block'>
              <Link
                className={`nav-link ${styles['nav-link-text']} ${isStickers ? 'active' : ''}`}
                {...(isStickers ? { 'aria-current': 'page' } : {})}
                href='/stickers'>
                Stickers
              </Link>
            </li>
            <li className='nav-item d-block d-sm-none d-md-none d-lg-block d-xl-block'>
              <Link
                className={`nav-link ${styles['nav-link-text']} ${isWhitepaper ? 'active' : ''}`}
                {...(isWhitepaper ? { 'aria-current': 'page' } : {})}
                href='/whitepaper'>
                Whitepaper
              </Link>
            </li>
            <li className='nav-item d-block d-sm-none d-md-none d-lg-block'>
              <Link
                className={`nav-link ${styles['nav-link-text']} ${isRoadmap ? 'active' : ''}`}
                {...(isRoadmap ? { 'aria-current': 'page' } : {})}
                href='/roadmap'>
                Roadmap
              </Link>
            </li>
            {/* <li className='nav-item d-block d-sm-none'>
              <Link
                className={`nav-link ${styles['nav-link-text']} ${isResources ? 'active' : ''}`}
                {...(isResources ? { 'aria-current': 'page' } : {})}
                href='/resources'>
                Resources
              </Link>
            </li> */}
            <div className='flex-grow-1' />
            <div className={styles['social-links']}>
              <NavLinkFAIcon
                icon={faTelegram}
                style={{ marginRight: '-1px' }}
                title='Telegram'
                url='https://t.co/OjMn6rdbaU'
              />
              <NavLinkFAIcon
                icon={faXTwitter}
                title='X - Twitter'
                url='https://twitter.com/mspaintsol'
              />
              <NavLinkIcon
                imageSrc='/external-sites/farcaster.png'
                title='Farcaster'
                url='https://warpcast.com/paintsol'
              />
            </div>
            <div className={styles['social-links']}>
              <NavLinkIcon
                className='d-sm-none d-md-none d-xl-block'
                imageSrc='/external-sites/birdeye.svg'
                title='Birdeye'
                url='https://birdeye.so/token/8x9c5qa4nvakKo5wHPbPa5xvTVMKmS26w4DRpCQLCLk3?chain=solana'
              />
              <NavLinkIcon
                className='d-sm-none d-md-none d-xl-block'
                imageSrc='/external-sites/dexscreener.svg'
                title='DEX Screener'
                url='https://dexscreener.com/solana/8x9c5qa4nvakKo5wHPbPa5xvTVMKmS26w4DRpCQLCLk3'
              />
              <NavLinkIcon
                className='d-sm-none d-md-none d-xl-block'
                imageSrc='/external-sites/dextools.svg'
                title='DEXTools'
                url='https://www.dextools.io/app/en/solana/pair-explorer/NniGZMgEpXL9jTmEATcKMxUbmH5cSNALngJKAQLTXzB'
              />
              <NavLinkIcon
                className='d-sm-none d-md-none d-xl-block'
                imageSrc='/external-sites/coingecko.svg'
                title='CoinGecko'
                url='https://www.coingecko.com/en/coins/ms-paint/usd'
              />
              <div className='d-none d-sm-block d-xl-none'>
                <Dropdown
                  alignRight
                  dropdownClassName={styles['dropdown']}
                  dropdownToggleClassName={styles['dropdown-toggle']}
                  dropdownMenuClassName={styles['dropdown-menu']}
                  dropdownItems={dropdownItems}
                />
              </div>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  )
}
