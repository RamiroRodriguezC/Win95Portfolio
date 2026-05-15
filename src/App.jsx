import Desktop from './components/Desktop/Desktop'
import Taskbar from './components/Taskbar/Taskbar'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Desktop />
      <Taskbar />
    </div>
  )
}
