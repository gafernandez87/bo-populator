import styles from './page.module.css'
import BetButtons from '@/client/BetButtons'

export default function Home() {
  return (
    <main className={styles.main}>
      <BetButtons />
    </main>
  )
}
