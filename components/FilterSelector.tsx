import { FilterTypes, ViewTypes } from '@/lib/types'
import styles from '@/styles/components/FilterSelector.module.css'
import ViewTypeSelector from './ViewTypeSelector'
import { ImageType } from '@/services/image'

type Props = {
  filterSelected: FilterTypes
  handleSelectFilter: (filterType: FilterTypes) => {}
  handleSelectImageType: (imageType: ImageType) => {}
  handleSelectViewType: (viewType: ViewTypes) => void
  imageTypeSelected: ImageType
  viewTypeSelected: ViewTypes
}

export default function FilterSelector({
  filterSelected,
  handleSelectFilter,
  handleSelectImageType,
  handleSelectViewType,
  imageTypeSelected,
  viewTypeSelected
}: Props) {


  const filterSelectorNode = (isMobile: boolean) => (
    <div className={styles['filter-selector-wrapper']}>
      <div className={`form-check ${styles['filter-radio-wrapper']}`}>
        <input
          checked={filterSelected === 'by-tag'}
          className="form-check-input"
          id={`radioFilterSelectedTag${isMobile ? '-mobile' : ''}`}
          name={`radioFilterSelected${isMobile ? '-mobile' : ''}`}
          onChange={() => handleSelectFilter('by-tag')}
          type="radio"
        />
        <label className="form-check-label" htmlFor={`radioFilterSelectedTag${isMobile ? '-mobile' : ''}`}>
          Tag
        </label>
      </div>
      <div className={`form-check ${styles['filter-radio-wrapper']}`}>
        <input
          checked={filterSelected === 'by-artist'}
          className="form-check-input"
          id={`radioFilterSelectedArtist${isMobile ? '-mobile' : ''}`}
          name={`radioFilterSelected${isMobile ? '-mobile' : ''}`}
          onChange={() => handleSelectFilter('by-artist')}
          type="radio"
        />
        <label className="form-check-label" htmlFor={`radioFilterSelectedArtist${isMobile ? '-mobile' : ''}`}>
          Artist
        </label>
      </div>
    </div>
  )

  const imageTypeSelectorNode = (isMobile: boolean) => (
    <select
      aria-label='Image type'
      className={`form-select ${styles['filter-image-type']}`}
      id='image-type'
      onChange={handleSelectImageType as any}>
      <option selected={imageTypeSelected === 'painting-and-meme'} value="painting-and-meme">All</option>
      <option selected={imageTypeSelected === 'painting'} value="painting">Paintings</option>
      <option selected={imageTypeSelected === 'meme'} value="meme">Memes</option>
    </select>
  )

  return (
    <div className='row'>
      <div className={`d-block d-sm-none ${styles['filter-wrapper-sm']}`}>
        <div className={styles['filter-selector-sm']}>
          {filterSelectorNode(true)}
        </div>
        <div className={styles['filter-image-type-sm']}>
          {imageTypeSelectorNode(true)}
        </div>
      </div>
      <div className='d-none d-sm-block col-sm-6 col-lg-8 order-sm-2'>
        {filterSelectorNode(false)}
      </div>
      <div className='d-none d-sm-block col-sm-3 col-lg-2 order-sm-1'>
        {imageTypeSelectorNode(false)}
      </div>
      <div className='col-sm-3 col-lg-2 order-sm-3'>
        <ViewTypeSelector
          handleSelectViewType={handleSelectViewType}
          viewTypeSelected={viewTypeSelected}
        />
      </div>
    </div>
  )
}
