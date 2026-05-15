import styles from './FolderWindow.module.css'

export default function FolderWindow({ appId }) {
  return (
    <div className={styles.folder}>
      Folder: {appId} — WIP
    </div>
  )
}
