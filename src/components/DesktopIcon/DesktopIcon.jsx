import { useWindowStore } from '../../store/windowStore'
import styles from './DesktopIcon.module.css'

export default function DesktopIcon({ appId, title, icon }) {
  const openWindow = useWindowStore(s => s.openWindow)

  return (
    <div className={styles.icon} onDoubleClick={() => openWindow(appId)}>
      <img src={icon} alt={title} className={styles.iconImg} />
      <span className={styles.label}>{title}</span>
    </div>
  )
}
