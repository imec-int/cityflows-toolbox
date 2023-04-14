import type { RootState } from '../index'
import type { CFState } from './slice'
import { createSelector, Selector } from '@reduxjs/toolkit'

type CFSelector<T> = Selector<CFState, T>

export function selectCFState(state: RootState) {
  return state.cf
}

const selectFromCFState =
  <T>(cfStateSelector: CFSelector<T>) =>
  (state: RootState) => {
    return cfStateSelector(selectCFState(state))
  }

export const selectDatasets = selectFromCFState((cfState) => cfState.datasets)
export const selectSensorCollection = selectFromCFState(
  (cfState) => cfState.sensorCollection
)

export const selectDatasetVisibility = selectFromCFState(
  (cfState) => cfState.datasetVisibility
)

export const selectSelectedSensors = createSelector(
  selectSensorCollection,
  (sensorCollection) => sensorCollection.filter((sensor) => sensor.selected)
)

export const selectVisibleSensors = createSelector(
  selectSensorCollection,
  selectDatasetVisibility,
  (sensorCollection, datasetVisibility) => {
    return sensorCollection.filter(
      (sensor) => datasetVisibility[sensor.sensorType.name]
    )
  }
)
