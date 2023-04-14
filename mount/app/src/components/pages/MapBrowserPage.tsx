import { SensorMap } from '../index'
import { MultiSource } from '../analytics'
import { LoginModal } from '../auth/LoginModal'

export default function MapBrowserPage() {
  return (
    <div className="App">
      <LoginModal />
      <SensorMap />
      <MultiSource />
    </div>
  )
}
