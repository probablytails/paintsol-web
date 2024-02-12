import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import FAIcon from './FAIcon'
import styles from '@/styles/components/LoadingSpinner.module.css'

type Props = {
  fullHeight?: boolean
}

export default function LoadingSpinner({ fullHeight }: Props) {
  const classNames = fullHeight
    ? `${styles['loading-wrapper-full-height']}`
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
