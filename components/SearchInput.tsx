import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import _debounce from 'lodash/debounce'
import { ChangeEvent, useCallback, useState } from 'react'
import FAIcon from './FAIcon'
import styles from '@/styles/components/SearchInput.module.css'

type Props = {
  handleSearch: Function
}

export default function SearchInput(props: Props) {
  const [inputText, setInputText] = useState('')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(_debounce(handleSearch, 1000), [])

  function handleSearch(value: string) {
    props.handleSearch(value)
  }

  function handleChange (event: ChangeEvent<HTMLInputElement>) {
    setInputText(event.target.value)
    debounceFn(event.target.value)
  };

  return (
    <div className={styles['search-wrapper']}>
      <div className={`input-group rounded ${styles['search-input']}`}>
        <input
          aria-describedby='search-addon'
          aria-label='Search'
          className='form-control rounded'
          onChange={(e) => handleChange(e)}
          placeholder='Search'
          type='search'
          value={inputText}
        />
        {
          !inputText && (
            <FAIcon
              className={styles['search-icon']}
              icon={faSearch}
              title='Search'
            />
          )
        }
      </div>
    </div>
  )
}
