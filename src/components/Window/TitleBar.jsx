import styles from './Window.module.css'

export default function TitleBar({ title, onClose, onMinimize }) {
  return (
    <div className={styles.titleBar}>
      <span className={styles.titleText}>{title}</span>
      <div className={styles.titleButtons}>
        <button className={styles.titleBtn} onClick={onMinimize}>_</button>
        <button className={styles.titleBtn} onClick={onClose}>X</button>
      </div>
    </div>
  )
}
