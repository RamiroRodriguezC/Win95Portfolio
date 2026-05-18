import { useState } from 'react'
import { useWindowStore } from '../../store/windowStore'
import { APP_REGISTRY } from '../../apps/_registry'
import styles from './StartMenu.module.css'

export default function StartMenu({ onClose }) {
  const openWindow = useWindowStore(s => s.openWindow)
  const windows = useWindowStore(s => s.windows)

  const handleAppClick = (appId) => {
    const existing = windows.find(w => w.appId === appId)
    if (existing && existing.isMinimized) {
      useWindowStore.getState().restoreWindow(existing.id)
    } else if (existing) {
      useWindowStore.getState().focusWindow(existing.id)
    } else {
      openWindow(appId)
    }
    onClose()
  }

  const appList = Object.entries(APP_REGISTRY).filter(
    ([, app]) => app.type === 'app'
  )

  const grouped = [
    { label: 'Programs', items: appList },
  ]

  return (
    <div className={styles.menu}>
      <div className={styles.sidebar}>
        <span className={styles.sidebarText}>Windows95</span>
      </div>
      <div className={styles.items}>
        {grouped.map((group) =>
          group.items.map(([appId, app]) => (
            <div
              key={appId}
              className={styles.item}
              onClick={() => handleAppClick(appId)}
            >
              <img src={app.icon} alt="" className={styles.itemIcon} />
              <span className={styles.itemText}>{app.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
