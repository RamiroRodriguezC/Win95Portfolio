import { APP_REGISTRY } from '../../apps/_registry'
import { useWindowStore } from '../../store/windowStore'
import DesktopIcon from '../DesktopIcon/DesktopIcon'
import Window from '../Window/Window'
import styles from './Desktop.module.css'

export default function Desktop() {
  const windows = useWindowStore(s => s.windows)

  return (
    <div className={styles.desktop}>
      <div className={styles.iconGrid}>
        {Object.entries(APP_REGISTRY).map(([appId, app]) => (
          <DesktopIcon key={appId} appId={appId} title={app.title} icon={app.icon} />
        ))}
      </div>
      <div className={styles.windowsLayer}>
        {windows.map(win => (
          <Window key={win.id} windowData={win} />
        ))}
      </div>
    </div>
  )
}
