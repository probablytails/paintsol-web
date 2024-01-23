import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import FAIcon from "./FAIcon";
import styles from '@/styles/components/LoadingSpinner.module.css';

export default function LoadingSpinner() {
  return (
    <div className={styles['loading-wrapper']}>
      <FAIcon 
        className={styles['loading-icon']}
        icon={faSpinner}
        spin
        title="Loading..."
      />
    </div>
  )
}
