/*
  TODO: The SearchInput, SearchInputArtists, and SearchInputTags should be
  combined into one component, but I was having problems getting the
  state to update properly with debounce in useCallback in SearchInput,
  and decided to just remove useCallback for SearchInputTags and
  SearchInputArtists and add them to the upload-image page.
*/

import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { escapeRegExp } from 'lodash'
import { Dispatch, KeyboardEvent, SetStateAction, useEffect, useRef, useState } from 'react'
import { Artist } from '@/lib/types'
import FAIcon from './FAIcon'
import styles from '@/styles/components/SearchInput.module.css'
import ArtistLink from './ArtistLink'

type Props = {
  allArtists: Artist[]
  handleSelectArtist: (selectedArtist?: string) => void
  inputText: string
  setInputText: Dispatch<SetStateAction<string>>
}

export default function SearchInputArtists({ allArtists, handleSelectArtist,
  inputText, setInputText }: Props) {
  const [inputHasFocus, setInputHasFocus] = useState(false)
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([])
  const searchInputRef = useRef<any>(null)
  const dropdownMenuRef = useRef<any>(null)

  useEffect(() => {
    window.addEventListener('mousedown', handleOutSideClick)
    window.addEventListener('keydown', handleOutSideClick)
    return () => {
      window.removeEventListener('mousedown', handleOutSideClick)
      window.removeEventListener('keydown', handleOutSideClick)
    }
  }, [])

  function handleOutSideClick (event: any) {
    if (
      !searchInputRef.current?.contains(event.target)
      && !dropdownMenuRef.current?.contains(event.target)
    ) {
      setInputHasFocus(false)
    }
  }

  function handleFilter(inputText: string) {
    handleFilterArtists(inputText)
  }

  function handleFilterArtists(inputText: string) {
    const strRegExPattern = `.*${escapeRegExp(inputText?.toLowerCase())}.*`
    const newFilteredArtists = allArtists?.filter((artist) => {
      return artist?.name?.toLowerCase().match(new RegExp(strRegExPattern,'g'))
    })
    setFilteredArtists(newFilteredArtists)
  }

  function handleChange (text: string, removeFocus: boolean) {
    setInputText(text)
    handleFilter(text)
    setInputHasFocus(!removeFocus)
  }

  function artistLinkOnClick(artist: Artist) {
    handleSelectArtist(artist?.name)
  }

  function artistLinkOnKeyUp (artist: Artist, event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter') {
      handleSelectArtist(artist?.name)
    }
  }

  function handleInputKeyUp (event: any) {
    if (event.key === 'Enter') {
      const val = event.target.value || ''
      const artist = getArtistByName(val)
      handleSelectArtist(artist?.name || val)
    }
  }

  function getArtistByName(name: string) {
    const artist = allArtists.find((artist: Artist) =>
      artist?.name?.toLowerCase() === name?.toLowerCase())
    return artist || null
  }

  const artistLinks = filteredArtists?.map((artist) => {
    return (
      <ArtistLink
        has_profile_picture={artist.has_profile_picture}
        id={artist.id}
        key={`search-artist-${artist.id}`}
        name={artist.name}
        onClick={() => artistLinkOnClick(artist)}
        onKeyUp={(event) => artistLinkOnKeyUp(artist, event)}
        withBorder
      />
    )
  })

  const placeholder = 'Search for artist'

  return (
    <div className={styles['search-wrapper']}>
      <div className={`input-group rounded ${styles['search-input']}`}>
        <input
          aria-describedby='search-addon'
          aria-label='Search'
          className='form-control rounded'
          onChange={(e) => handleChange(e?.target?.value, false)}
          onFocus={() => setInputHasFocus(true)}
          onKeyUp={handleInputKeyUp}
          placeholder={placeholder}
          ref={searchInputRef}
          type='text'
          value={inputText}
        />
        {
          !inputText && (
            <FAIcon
              className={styles['search-icon']}
              icon={faSearch}
              title={placeholder}
            />
          )
        }
      </div>
      {
        inputHasFocus && inputText && artistLinks?.length > 0 && (
          <div className={styles['search-dropdown-menu']} ref={dropdownMenuRef}>
            {artistLinks}
          </div>
        )
      }
    </div>
  )
}
