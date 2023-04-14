import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import {
  selectSelectedSensors,
  Sensor,
  setMultiSourceRefs,
  setMultiSources,
  setSelectedSensors,
  toggleSensorSelection,
} from '../../store/CFState'

import { DeselectionBtn } from '../shared'
import { useAppDispatch } from '../../hooks'

// TODO: can the API format the data this way?
//  we can load datasets in individual layers, making it more efficient
//  to iterate over in the future
// ps: this was copied from SO
// @ts-ignore
const groupBy = function (xs, key) {
  // @ts-ignore
  return xs.reduce(function (rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export function SensorSelectionManager() {
  const { t } = useTranslation()
  const selectedSensors: Sensor[] = useSelector(selectSelectedSensors)
  const dispatch = useAppDispatch()

  // TODO: load sensor data per dataset instead of grouping like this
  const selectedSensorsByDataset: { [key: string]: Sensor[] } = groupBy(
    selectedSensors.map((s) => ({
      ...s,
      dataset: s.sensorType.name,
    })),
    'dataset'
  )

  function openSourceAnalysis() {
    dispatch(setMultiSources(selectedSensors))
    dispatch(
      setMultiSourceRefs(selectedSensors.map(({ ref }) => ref).join(','))
    )
  }

  const deselectSensor = (sensor: Sensor) => () =>
    dispatch(toggleSensorSelection(sensor))

  const deselectAllSensors = () => dispatch(setSelectedSensors([]))

  return (
    <div>
      <div className="sensorsList">
        <h4 className="mb-2">
          {selectedSensors.length || ''} {t('sensorMap.selectedSensors')}
        </h4>
        {selectedSensors.length > 0 ? null : (
          <i>{t('sensorMap.selectionInstructions')}</i>
        )}
        {selectedSensors.length ? (
          <DeselectionBtn
            className="unselectAllSensorsBtn"
            onClick={deselectAllSensors}
          >
            {t('sensorMap.deselectAll')}
          </DeselectionBtn>
        ) : null}
        {Object.entries(selectedSensorsByDataset).map(
          ([datasetName, selectedSensors]) => {
            return (
              <div className="mt-3" key={datasetName + 'selectedSensors'}>
                <h5 className="mb-2">
                  {selectedSensors.length} {datasetName}
                </h5>
                <ul>
                  {selectedSensors.map((sensor) => (
                    <li key={datasetName + 'selectedSensor' + sensor.ref}>
                      <DeselectionBtn onClick={deselectSensor(sensor)}>
                        {sensor.extraFields?.addressString
                          ? sensor.extraFields.addressString
                          : sensor.ref}
                      </DeselectionBtn>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
        )}
      </div>
      {selectedSensors.length > 0 ? (
        <div className="exploreSensorsBtnContainer">
          <button
            disabled={selectedSensors.length === 0}
            onClick={openSourceAnalysis}
          >
            {t('sensorMap.exploreSensorsData')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
