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
import { Tag } from '@/lib/types'
import FAIcon from './FAIcon'
import TagBadge from './TagBadge'
import styles from '@/styles/components/SearchInput.module.css'

type Props = {
  allTags: Tag[]
  handleSelectTag: (selectedTagTitle?: string) => void
  inputText: string
  setInputText: Dispatch<SetStateAction<string>>
}

export default function SearchInputTags({ allTags, handleSelectTag,
  inputText, setInputText }: Props) {
  const [inputHasFocus, setInputHasFocus] = useState(false)
  const [filteredTags, setFilteredTags] = useState<Tag[]>([])
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
    handleFilterTags(inputText)
  }

  function handleFilterTags(inputText: string) {
    const strRegExPattern = `.*${escapeRegExp(inputText?.toLowerCase())}.*`
    const newFilteredTags = allTags?.filter((tag) => {
      return tag?.title?.toLowerCase().match(new RegExp(strRegExPattern,'g'))
    })
    setFilteredTags(newFilteredTags)
  }

  function handleChange (text: string, removeFocus: boolean) {
    setInputText(text)
    handleFilter(text)
    setInputHasFocus(!removeFocus)
  }

  function tagBadgeOnClick(tag: Tag) {
    handleSelectTag(tag?.title)
  }

  function tagBadgeOnKeyUp (tag: Tag, event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter') {
      handleSelectTag(tag?.title)
    }
  }

  function handleInputKeyUp (event: any) {
    if (event.key === 'Enter') {
      const val = event.target.value || ''
      const tag = getTagByTitle(val)
      handleSelectTag(tag?.title || val)
    }
  }

  function getTagByTitle(title: string) {
    const tag = allTags.find((tag: Tag) => tag?.title?.toLowerCase() === title?.toLowerCase())
    return tag || null
  }

  const tagBadges = filteredTags?.map((tag) => {
    return (
      <TagBadge
        onClick={() => tagBadgeOnClick(tag)}
        onKeyUp={(event) => tagBadgeOnKeyUp(tag, event)}
        key={`search-tag-${tag.id}`}
        title={tag.title}
      />
    )
  })

  const placeholder = 'Search for tag'

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
        inputHasFocus && inputText && tagBadges?.length > 0 && (
          <div className={styles['search-dropdown-menu']} ref={dropdownMenuRef}>
            {tagBadges}
          </div>
        )
      }
    </div>
  )
}
