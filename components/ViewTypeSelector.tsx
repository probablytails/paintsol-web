import { faTableCellsLarge } from '@fortawesome/free-solid-svg-icons/faTableCellsLarge'
import FAIcon from './FAIcon'
import { faTableCells } from '@fortawesome/free-solid-svg-icons/faTableCells'
import { ViewTypes } from '@/lib/types'
import styles from '@/styles/components/ViewTypeSelector.module.css'
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'

type Props = {
  handleSelectViewType: (viewType: ViewTypes) => void
  viewTypeSelected: ViewTypes
}

export default function ViewTypeSelector({ handleSelectViewType, viewTypeSelected }: Props) {
  return (
    <div className={styles['view-type-wrapper']}>
      <FAIcon
        activeColor='#333'
        buttonWrapperName={styles['view-type-icon-button-wrapper']}
        className={styles['view-type-icon']}
        color='#aaa'
        icon={faSquare}
        isActive={viewTypeSelected === 'large'}
        onClick={() => handleSelectViewType('large')}
        title='Large view'
      />
      <FAIcon
        activeColor='#333'
        buttonWrapperName={styles['view-type-icon-button-wrapper']}
        className={styles['view-type-icon']}
        color='#aaa'
        icon={faTableCellsLarge}
        isActive={viewTypeSelected === 'small'}
        onClick={() => handleSelectViewType('small')}
        title='Small view'
      />
      <FAIcon
        activeColor='#333'
        buttonWrapperName={styles['view-type-icon-button-wrapper']}
        className={styles['view-type-icon']}
        color='#aaa'
        icon={faTableCells}
        isActive={viewTypeSelected === 'tiny'}
        onClick={() => handleSelectViewType('tiny')}
        title='Tiny view'
      />
    </div>
  )
}