import { DatasetVisibilityManager } from './DatasetVisibilityManager'
import { SensorSelectionManager } from './SensorSelectionManager'

export function SensorControls() {
  return (
    <div className="sensorControls">
      <DatasetVisibilityManager />
      <SensorSelectionManager />
    </div>
  )
}
