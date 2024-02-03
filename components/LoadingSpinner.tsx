import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import FAIcon from './FAIcon'
import styles from '@/styles/components/LoadingSpinner.module.css'

type Props = {
  noMargin?: boolean
}

export default function LoadingSpinner({ noMargin }: Props) {
  const classNames = noMargin
    ? `${styles['loading-wrapper']} ${styles['no-margin']}`
    : styles['loading-wrapper']
  return (
    <div className={classNames}>
      <FAIcon 
        className={styles['loading-icon']}
        icon={faSpinner}
        spin
        title='Loading...'
      />
    </div>
  )
}
