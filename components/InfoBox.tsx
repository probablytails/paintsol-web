import styles from '@/styles/components/InfoBox.module.css'

type Props = {
  children: any
}

export default function InfoBox({ children }: Props) {
  return (
    <div className={styles['info-box']}>
      {children}
    </div>
  )
}
