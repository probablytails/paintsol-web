import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { escapeRegExp } from 'lodash'
import _debounce from 'lodash/debounce'
import { Dispatch, KeyboardEvent, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { Artist, Tag } from '@/lib/types'
import FAIcon from './FAIcon'
import ArtistLink from './ArtistLink'
import TagBadge from './TagBadge'
import styles from '@/styles/components/SearchInput.module.css'
import { usePrevious } from '@/lib/reactHelpers'

type Props = {
  allArtists: Artist[]
  allTags: Tag[]
  filterSelected: 'by-artist' | 'by-tag'
  handleSearch: (
    selectedArtistOrTag: Artist | Tag | null,
    filterSelected: 'by-artist' | 'by-tag'
  ) => void
  inputText: string
  setInputText: Dispatch<SetStateAction<string>>
}

export default function SearchInput({ allArtists, allTags, filterSelected,
  handleSearch, inputText, setInputText }: Props) {
  const [inputHasFocus, setInputHasFocus] = useState(false)
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([])
  const [filteredTags, setFilteredTags] = useState<Tag[]>([])
  const searchInputRef = useRef<any>(null)
  const dropdownMenuRef = useRef<any>(null)
  const prevState = usePrevious({ filterSelected })

  useEffect(() => {
    window.addEventListener('mousedown', handleOutSideClick)
    window.addEventListener('keydown', handleOutSideClick)
    return () => {
      window.removeEventListener('mousedown', handleOutSideClick)
      window.removeEventListener('keydown', handleOutSideClick)
    }
  }, [])

  useEffect(() => {
    if (
      !!prevState?.filterSelected
      && filterSelected !== prevState?.filterSelected as 'by-artist' | 'by-tag'
    ) {
      debouncedFilter(filterSelected, '')
    }
  }, [filterSelected])

  function handleOutSideClick (event: any) {
    if (
      !searchInputRef.current?.contains(event.target)
      && !dropdownMenuRef.current?.contains(event.target)
    ) {
      setInputHasFocus(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilter = useCallback(_debounce(handleFilter, 400), [])

  async function handleSearchDefault() {
    await handleSearch(null, filterSelected)
  }

  async function handleSearchByTag(tag: Tag) {
    debouncedFilter(filterSelected, tag.title)
    setInputHasFocus(false)
    setInputText(tag.title)
    await handleSearch(tag, filterSelected)
  }

  async function handleSearchByArtist(artist: Artist) {
    debouncedFilter(filterSelected, artist.name)
    setInputHasFocus(false)
    setInputText(artist.name)
    await handleSearch(artist, filterSelected)
  }

  function handleFilter(
    filterSelected: 'by-artist' | 'by-tag',
    inputText: string) {
    if (filterSelected === 'by-artist') {
      handleFilterArtists(inputText)
    } else if (filterSelected === 'by-tag') {
      handleFilterTags(inputText)
    }
  }

  function handleFilterTags(inputText: string) {
    const strRegExPattern = `.*${escapeRegExp(inputText?.toLowerCase())}.*`
    
    const newFilteredTags = allTags?.filter((tag) => {
      return tag?.title?.toLowerCase().match(new RegExp(strRegExPattern,'g'))
    })

    setFilteredTags(newFilteredTags)
    setFilteredArtists(allArtists)
  }

  function handleFilterArtists(inputText: string) {
    const strRegExPattern = `.*${escapeRegExp(inputText?.toLowerCase())}.*`
    
    const newFilteredArtists = allArtists?.filter((artist) => {
      return artist?.name?.toLowerCase().match(new RegExp(strRegExPattern,'g'))
    })

    setFilteredArtists(newFilteredArtists)
    setFilteredTags(allTags)
  }

  function handleChange (text: string, removeFocus: boolean) {
    setInputText(text)
    debouncedFilter(filterSelected, text)
    setInputHasFocus(!removeFocus)
    if (!text) {
      handleSearchDefault()
    }
  }

  function handleClear () {
    const removeFocus = true
    handleChange('', removeFocus)
    handleSearch(null, filterSelected)
  }

  function artistLinkOnClick(artist: Artist) {
    handleSearchByArtist(artist)
  }

  function artistLinkOnKeyUp (artist: Artist, event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter') {
      handleSearchByArtist(artist)
    }
  }

  function tagBadgeOnClick(tag: Tag) {
    handleSearchByTag(tag)
  }

  function tagBadgeOnKeyUp (tag: Tag, event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter') {
      handleSearchByTag(tag)
    }
  }

  function handleInputKeyUp (event: any) {
    if (event.key === 'Enter') {
      const val = event.target.value || ''
      if (filterSelected === 'by-artist') {
        const artist = getArtistByName(val)
        if (artist) {
          handleSearchByArtist(artist)
        }
      } else if (filterSelected === 'by-tag') {
        const tag = getTagByTitle(val)
        if (tag) {
          handleSearchByTag(tag)
        }
      }
    }
  }
  
  function getArtistByName(name: string) {
    const artist = allArtists.find((artist: Artist) =>
      artist?.name?.toLowerCase() === name?.toLowerCase())
    return artist || null
  }

  function getTagByTitle(title: string) {
    const tag = allTags.find((tag: Tag) => tag?.title?.toLowerCase() === title?.toLowerCase())
    return tag || null
  }

  const artists = filteredArtists?.length > 0 ? filteredArtists : allArtists
  const artistLinks = artists?.map((artist) => {
    return (
      <ArtistLink 
        key={`search-artist-${artist.id}`}
        name={artist.name}
        onClick={() => artistLinkOnClick(artist)}
        onKeyUp={(event) => artistLinkOnKeyUp(artist, event)}
      />
    )
  })

  const tags = filteredTags?.length > 0 ? filteredTags : allTags
  const tagBadges = tags?.map((tag) => {
    return (
      <TagBadge
        onClick={() => tagBadgeOnClick(tag)}
        onKeyUp={(event) => tagBadgeOnKeyUp(tag, event)}
        key={`search-tag-${tag.id}`}
        title={tag.title}
      />)
  })

  let placeholder = 'Search by tag'
  if (filterSelected === 'by-artist') {
    placeholder = 'Search by artist'
  }

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
        {
          inputText && (
            <FAIcon
              className={styles['clear-icon']}
              icon={faXmark}
              onClick={handleClear}
              title='Clear search input'
            />
          )
        }
      </div>
      {
        filterSelected === 'by-artist' && inputHasFocus && artistLinks?.length > 0 && (
          <div className={styles['search-dropdown-menu']} ref={dropdownMenuRef}>
            {artistLinks}
          </div>
        )
      }
      {
        filterSelected === 'by-tag' && inputHasFocus && tagBadges?.length > 0 && (
          <div className={styles['search-dropdown-menu']} ref={dropdownMenuRef}>
            {tagBadges}
          </div>
        )
      }
    </div>
  )
}
