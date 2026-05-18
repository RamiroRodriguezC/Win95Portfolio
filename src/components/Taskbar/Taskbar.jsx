import { useState } from 'react'
import { useWindowStore } from '../../store/windowStore'
import { APP_REGISTRY } from '../../apps/_registry'
import Clock from './Clock'
import StartMenu from './StartMenu'
import styles from './Taskbar.module.css'

export default function Taskbar() {
  const [startOpen, setStartOpen] = useState(false)
  const { windows, restoreWindow, minimizeWindow } = useWindowStore()

  return (
    <div className={styles.taskbar}>
      <div className={styles.startWrapper}>
        <button
          className={`${styles.startBtn} ${startOpen ? styles.startBtnPressed : ''}`}
          onClick={() => setStartOpen(v => !v)}
        >
          <img src="/icons/miscellaneous/winIcon.png" alt="" className={styles.startIcon} />Start
        </button>
        {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
      </div>
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
