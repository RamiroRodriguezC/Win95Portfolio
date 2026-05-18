import { APP_REGISTRY } from '../../apps/_registry'
import { DESKTOP_ITEMS } from '../../apps/_display'
import { useWindowStore } from '../../store/windowStore'
import IconGrid from '../IconGrid/IconGrid'
import Window from '../Window/Window'
import styles from './Desktop.module.css'

export default function Desktop() {
  const windows = useWindowStore(s => s.windows)

  const desktopApps = DESKTOP_ITEMS
    .map(id => {
      const entry = APP_REGISTRY[id]
      return entry ? { appId: id, title: entry.title, icon: entry.icon } : null
    })
    .filter(Boolean)

  return (
    <div className={styles.desktop}>
      <IconGrid apps={desktopApps} />
      <div className={styles.windowsLayer}>
        {windows.map(win => (
          <Window key={win.id} windowData={win} />
        ))}
      </div>
    </div>
  )
}
