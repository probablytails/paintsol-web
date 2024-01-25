import styles from '@/styles/components/AdminWidget.module.css'
import FAIcon from './FAIcon'
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear'
import Link from 'next/link'

export default function AdminWidget() {
  return (
    <Link href='/admin'>
      <div className={styles['admin-widget']}>
        <div className={styles['admin-text']}>
          Admin
        </div>
        <FAIcon
          className={styles['admin-icon']}
          icon={faGear}
          title='Admin'
        />
      </div>
    </Link>
  )
}
