import styles from '@/styles/components/Footer.module.css'

const disclaimerText = `
  This website is for entertainment and informational purposes only,
  not financial or investment advice. $PAINT, this website,
  and its related social media accounts are not affiliated with,
  sponsored by, or endorsed by Microsoft.
`

export default function Footer() {
  return (
    <div className={styles['footer']}>
      <p className={styles['disclaimer']}>
        {disclaimerText}
      </p>
    </div>
  )
}
