import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import _debounce from 'lodash/debounce'
import { Dispatch, KeyboardEvent, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import FAIcon from './FAIcon'
import styles from '@/styles/components/SearchInput.module.css'
import { Tag } from '@/lib/types'
import TagBadge from './TagBadge'
import { escapeRegExp } from 'lodash'

type Props = {
  allTags: Tag[]
  handleSearch: Function
  inputText: string
  setInputText: Dispatch<SetStateAction<string>>
}

export default function SearchInput({ allTags, handleSearch, inputText, setInputText }: Props) {
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
  })

  function handleOutSideClick (event: any) {
    if (
      !searchInputRef.current?.contains(event.target)
      && !dropdownMenuRef.current?.contains(event.target)
    ) {
      setInputHasFocus(false)
      handleFilterTags(allTags, inputText)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilterTags = useCallback(_debounce(handleFilterTags, 500), [])

  async function handleSearchByTag(tag: Tag) {
    debounceFilterTags(allTags, tag.title)
    setInputHasFocus(false)
    setInputText(tag.title)
    await handleSearch(tag)
  }

  function handleFilterTags(allTags: Tag[], inputText: string) {
    const strRegExPattern = `.*${escapeRegExp(inputText?.toLowerCase())}.*`
    
    const newFilteredTags = allTags?.filter((tag) => {
      return tag?.title?.toLowerCase().match(new RegExp(strRegExPattern,'g'))
    })

    setFilteredTags(newFilteredTags)
  }

  function handleChange (text: string) {
    setInputText(text)
    debounceFilterTags(allTags, text)
    setInputHasFocus(true)
  }

  function handleClear () {
    handleChange('')
    handleSearch()
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
      const tag = getTagByTitle(val)
      if (tag) {
        handleSearchByTag(tag)
      }
    }
  }

  function getTagByTitle(title: string) {
    const tag = allTags.find((tag: Tag) => tag?.title?.toLowerCase() === title?.toLowerCase())
    return tag || null
  }

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

  return (
    <div className={styles['search-wrapper']}>
      <div className={`input-group rounded ${styles['search-input']}`}>
        <input
          aria-describedby='search-addon'
          aria-label='Search'
          className='form-control rounded'
          onChange={(e) => handleChange(e?.target?.value)}
          onFocus={() => setInputHasFocus(true)}
          onKeyUp={handleInputKeyUp}
          placeholder='Search by tag'
          ref={searchInputRef}
          type='text'
          value={inputText}
        />
        {
          !inputText && (
            <FAIcon
              className={styles['search-icon']}
              icon={faSearch}
              title='Search by tag'
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
        inputHasFocus && tagBadges?.length > 0 && (
          <div className={styles['search-dropdown-menu']} ref={dropdownMenuRef}>
            {tagBadges}
          </div>
        )
      }
    </div>
  )
}
