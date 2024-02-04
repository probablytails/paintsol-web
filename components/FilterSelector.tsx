import { FilterTypes } from '@/lib/types'
import styles from '@/styles/components/FilterSelector.module.css'

type Props = {
  filterSelected: FilterTypes
  handleSelectFilter: any
}

export default function FilterSelector({
  filterSelected,
  handleSelectFilter
}: Props) {
  return (
    <div className={styles['filter-selector-wrapper']}>
      <div className={`form-check ${styles['filter-radio-wrapper']}`}>
        <input
          checked={filterSelected === 'by-tag'}
          className="form-check-input"
          id="radioFilterSelectedTag"
          name="radioFilterSelected"
          onChange={() => handleSelectFilter('by-tag')}
          type="radio"
        />
        <label className="form-check-label" htmlFor="radioFilterSelectedTag">
          Tag
        </label>
      </div>
      <div className={`form-check ${styles['filter-radio-wrapper']}`}>
        <input
          checked={filterSelected === 'by-artist'}
          className="form-check-input"
          id="radioFilterSelectedArtist"
          name="radioFilterSelected"
          onChange={() => handleSelectFilter('by-artist')}
          type="radio"
        />
        <label className="form-check-label" htmlFor="radioFilterSelectedArtist">
          Artist
        </label>
      </div>
    </div>
  )
}
