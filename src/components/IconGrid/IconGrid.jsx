import DesktopIcon from '../DesktopIcon/DesktopIcon'
import styles from './IconGrid.module.css'

export default function IconGrid({ apps }) {
  return (
    <div className={styles.iconGrid}>
      {apps.map(app => (
        <DesktopIcon key={app.appId} appId={app.appId} title={app.title} icon={app.icon} />
      ))}
    </div>
  )
}
