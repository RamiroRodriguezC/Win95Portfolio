import { useWindowStore } from '../../store/windowStore'
import { APP_REGISTRY } from '../../apps/_registry'
import Clock from './Clock'
import styles from './Taskbar.module.css'

export default function Taskbar() {
  const { windows, restoreWindow, minimizeWindow } = useWindowStore()

  return (
    <div className={styles.taskbar}>
      <button className={styles.startBtn}>Start</button>
      <div className={styles.windowButtons}>
        {windows.map(win => {
          const app = APP_REGISTRY[win.appId]
          return (
            <button
              key={win.id}
              className={styles.taskBtn}
              onClick={() => win.isMinimized ? restoreWindow(win.id) : minimizeWindow(win.id)}
            >
              {app?.title || win.appId}
            </button>
          )
        })}
      </div>
      <Clock />
    </div>
  )
}
