import { FilterTypes, ViewTypes } from '@/lib/types'
import styles from '@/styles/components/FilterSelector.module.css'
import ViewTypeSelector from './ViewTypeSelector'

type Props = {
  filterSelected: FilterTypes
  handleSelectFilter: (filterType: FilterTypes) => {}
  handleSelectViewType: (viewType: ViewTypes) => void
  viewTypeSelected: ViewTypes
}

export default function FilterSelector({
  filterSelected,
  handleSelectFilter,
  handleSelectViewType,
  viewTypeSelected
}: Props) {
  return (
    <div className='row'>
      <div className='d-none d-sm-block col-sm-2'></div>
      <div className='col-sm-8'>
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
      </div>
      <div className='col-sm-2 justify-center'>
        <ViewTypeSelector
          handleSelectViewType={handleSelectViewType}
          viewTypeSelected={viewTypeSelected}
        />
      </div>
    </div>
  )
}
