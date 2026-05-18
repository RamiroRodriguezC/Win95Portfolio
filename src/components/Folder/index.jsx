import { APP_REGISTRY } from '../../apps/_registry'
import { FOLDER_CONTENTS } from '../../apps/_display'
import IconGrid from '../IconGrid/IconGrid'
import styles from './Folder.module.css'

export default function Folder({ appId }) {
  const childrenIds = FOLDER_CONTENTS[appId] || []
  const children = childrenIds
    .map(id => {
      const entry = APP_REGISTRY[id]
      return entry ? { appId: id, title: entry.title, icon: entry.icon } : null
    })
    .filter(Boolean)

  return (
    <div className={styles.folder}>
      <IconGrid apps={children} />
    </div>
  )
}
