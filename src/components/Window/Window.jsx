import { Suspense } from 'react'
import { Rnd } from 'react-rnd'
import { APP_REGISTRY } from '../../apps/_registry'
import { useWindowStore } from '../../store/windowStore'
import TitleBar from './TitleBar'
import FolderWindow from '../FolderWindow/FolderWindow'
import styles from './Window.module.css'

export default function Window({ windowData: win }) {
  const app = APP_REGISTRY[win.appId]
  const { closeWindow, minimizeWindow, focusWindow } = useWindowStore()

  if (!app) return null

  const AppComponent = app.component

  return (
    <Rnd
      default={{
        x: 50 + Math.random() * 100,
        y: 50 + Math.random() * 50,
        width: app.defaultSize.width,
        height: app.defaultSize.height,
      }}
      style={{ zIndex: win.zIndex }}
      onMouseDown={() => focusWindow(win.id)}
      minWidth={200}
      minHeight={100}
      className={styles.window}
    >
      <div className={styles.windowInner}>
        <TitleBar
          title={app.title}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
        />
        <div className={styles.content}>
          {app.type === 'folder' ? (
            <FolderWindow appId={win.appId} />
          ) : (
            <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
              <AppComponent />
            </Suspense>
          )}
        </div>
      </div>
    </Rnd>
  )
}
