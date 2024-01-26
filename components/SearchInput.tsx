import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import _debounce from 'lodash/debounce'
import { ChangeEvent, KeyboardEvent, Ref, useCallback, useEffect, useRef, useState } from 'react'
import FAIcon from './FAIcon'
import styles from '@/styles/components/SearchInput.module.css'
import { Tag } from '@/lib/types'
import TagBadge from './TagBadge'

type Props = {
  allTags: Tag[]
  handleSearch: Function
}

export default function SearchInput({ allTags, handleSearch }: Props) {
  const [inputText, setInputText] = useState('')
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
    const strRegExPattern = `.*${inputText}.*`; 
    
    const newFilteredTags = allTags?.filter((tag) => {
      return tag?.title?.match(new RegExp(strRegExPattern,'g'))
    })

    setFilteredTags(newFilteredTags)
  }

  function handleChange (event: ChangeEvent<HTMLInputElement>) {
    setInputText(event.target.value)
    debounceFilterTags(allTags, event.target.value)
  };

  function tagOnClick(tag: Tag) {
    handleSearchByTag(tag)
  }

  function tagOnKeyUp (tag: Tag, event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter') {
      handleSearchByTag(tag)
    }
  }

  function updateInputHasFocus(bool: boolean) {
    setTimeout(() => {
      setInputHasFocus(bool)
    }, 0)
  }

  const tags = filteredTags?.length > 0 ? filteredTags : allTags
  const tagBadges = tags?.map((tag) => {
    return (
      <TagBadge
        onClick={() => tagOnClick(tag)}
        onKeyUp={(event) => tagOnKeyUp(tag, event)}
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
          onChange={(e) => handleChange(e)}
          onFocus={() => updateInputHasFocus(true)}
          placeholder='Search by tag'
          ref={searchInputRef}
          type='search'
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
