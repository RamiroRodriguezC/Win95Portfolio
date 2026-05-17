import { useWindowStore } from '../../store/windowStore'
import styles from './DesktopIcon.module.css'

const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0

export default function DesktopIcon({ appId, title, icon }) {
  const openWindow = useWindowStore(s => s.openWindow)

  const handleClick = () => {
    if (isTouchDevice()) {
      openWindow(appId)
    }
  }

  return (
    <div
      className={styles.icon}
      onDoubleClick={isTouchDevice() ? undefined : () => openWindow(appId)}
      onClick={handleClick}
    >
      <img src={icon} alt={title} className={styles.iconImg} />
      <span className={styles.label}>{title}</span>
    </div>
  )
}
