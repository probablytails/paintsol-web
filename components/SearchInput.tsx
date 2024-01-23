import FAIcon from "./FAIcon";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import styles from '@/styles/components/SearchInput.module.css';
import { useState } from "react";

export default function SearchInput() {
  const [inputText, setInputText] = useState('')

  return (
    <div className={styles['search-wrapper']}>
      <div className={`input-group rounded ${styles['search-input']}`}>
        <input
          aria-describedby="search-addon"
          aria-label="Search"
          className="form-control rounded"
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Search"
          type="search"
          value={inputText}
        />
        {
          !inputText && (
            <FAIcon
              className={styles['search-icon']}
              height={17}
              icon={faSearch}
              title='Search'
              width={17}
            />
          )
        }
      </div>
    </div>
  )
}
