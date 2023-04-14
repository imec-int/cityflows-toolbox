import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  DatasetVisibility,
  Modality,
  ModalityCombination,
  ModalityReverseCombinations,
  Sensor,
  SourceTracks,
  TimePeriod,
  TrackViewType,
} from './types'
import { CreateTimePeriod } from '../../utils/timePeriod'
import { INITIAL_TIME_WINDOWS } from '../../constants'

export type CFState = {
  loadingData: boolean
  datasets: string[]
  datasetVisibility: DatasetVisibility
  sensorCollection: Sensor[]
  needUpdateMultiTrack: boolean
  browsingMultiSourceRefs: string | null
  browsingMultiSources: Sensor[] | null
  browsingMultiSourceRefModalityReverseCombinations: ModalityReverseCombinations
  browsingMultiSourceTracks: SourceTracks | null
  browsingMultiSourceTracksViewType: TrackViewType
  basePopulationSensorRef: string | null
  selectedTimePeriods: TimePeriod[]
}

const initialState: CFState = {
  loadingData: false,
  datasets: [],
  datasetVisibility: {},
  sensorCollection: [],
  needUpdateMultiTrack: false,
  browsingMultiSourceRefs: null,
  browsingMultiSources: null,
  browsingMultiSourceRefModalityReverseCombinations: {},
  browsingMultiSourceTracks: null,
  browsingMultiSourceTracksViewType: TrackViewType.Summary,
  basePopulationSensorRef: null,
  selectedTimePeriods: INITIAL_TIME_WINDOWS.map(function (timeWindow) {
    return {
      ...timeWindow,
      ...{ to: Date.parse(timeWindow.to), from: Date.parse(timeWindow.from) },
    }
  }),
}

export const CFSlice = createSlice({
  name: 'cf',
  initialState,
  reducers: {
    loadDatasets: (state, action: PayloadAction<Sensor[]>) => {
      const sensorCollection = action.payload
      const datasets: string[] = Array.from(
        new Set(sensorCollection.map((sensor) => sensor.sensorType.name))
      )
      return {
        ...state,
        datasets,
        sensorCollection,
        datasetVisibility: datasets.reduce(
          (datasetVisibility, dataset: string) => {
            // initially all datasets should be visible
            datasetVisibility[dataset] = true
            return datasetVisibility
          },
          {} as DatasetVisibility
        ),
      }
    },
    setUpdateNeededTrigger: (state, action: PayloadAction<boolean>) => {
      state.needUpdateMultiTrack = action.payload
    },
    addTimePeriod: (state) => {
      state.selectedTimePeriods.push(CreateTimePeriod())
      state.needUpdateMultiTrack = true
    },
    removeTimePeriod: (state, action: PayloadAction<number>) => {
      const indexToRemove = action.payload
      state.selectedTimePeriods.splice(indexToRemove, 1)
      state.needUpdateMultiTrack = true
    },
    alterTimePeriod: (
      state,
      action: PayloadAction<{
        index: number
        changes: Partial<TimePeriod>
      }>
    ) => {
      const { index, changes } = action.payload
      const currentTimePeriod = state.selectedTimePeriods[index]
      state.selectedTimePeriods[index] = {
        ...currentTimePeriod,
        ...changes,
      }
      state.needUpdateMultiTrack = true
    },
    updateMultiSourceTrackCombinations: (
      state,
      action: PayloadAction<{
        combination: [string, Modality, boolean]
        value: boolean
      }>
    ) => {
      const {
        combination: [sensorRef, modality, currentValue],
        value,
      } = action.payload

      state.needUpdateMultiTrack = true
      state.browsingMultiSourceRefModalityReverseCombinations[sensorRef][
        modality
      ][currentValue.toString()] = value
    },
    updateMultiSourceTrackCombinationsForModality: (
      state,
      action: PayloadAction<{
        modality: Modality
        value: boolean
      }>
    ) => {
      const { modality, value } = action.payload
      const combinations =
        state.browsingMultiSourceRefModalityReverseCombinations

      state.browsingMultiSources?.forEach((sensor: Sensor) => {
        if (sensor.modalities.includes(modality)) {
          combinations[sensor.ref][modality]['false'] = value
          if (sensor.hasReverse)
            combinations[sensor.ref][modality]['true'] = value
        }
      })

      state.needUpdateMultiTrack = true
    },
    setMultiSourceTrackCombinations: (
      state,
      action: PayloadAction<ModalityReverseCombinations>
    ) => {
      state.browsingMultiSourceRefModalityReverseCombinations = action.payload
      state.needUpdateMultiTrack = true
    },
    setMultiSourceRefs: (state, action: PayloadAction<string>) => {
      state.browsingMultiSourceRefs = action.payload
      state.needUpdateMultiTrack = true
    },
    setBasePopulationSensorRef: (state, action: PayloadAction<string>) => {
      state.basePopulationSensorRef = action.payload
      state.needUpdateMultiTrack = true
    },
    setMultiSources: (state, action: PayloadAction<Sensor[]>) => {
      const sensors = action.payload
      const combinations =
        state.browsingMultiSourceRefModalityReverseCombinations
      const seenRefs = []

      for (let sensor of sensors) {
        if (!combinations[sensor.ref]) {
          combinations[sensor.ref] = {} as ModalityCombination
          for (let modality of sensor.modalities) {
            combinations[sensor.ref][modality] = { false: false }
            if (sensor.hasReverse)
              combinations[sensor.ref][modality]['true'] = false
          }
        }
        seenRefs.push(sensor.ref)
      }

      for (let ref in combinations) {
        if (!seenRefs.includes(ref)) delete combinations[ref]
      }

      state.browsingMultiSources = sensors
    },
    setMultiSourceTracksViewType: (
      state,
      action: PayloadAction<TrackViewType>
    ) => {
      state.needUpdateMultiTrack = true
      state.browsingMultiSourceTracksViewType = action.payload
    },
    setMultiSourceTracks: (state, action: PayloadAction<SourceTracks>) => {
      state.browsingMultiSourceTracks = action.payload
    },
    setLoadingData: (state, action: PayloadAction<boolean>) => {
      state.loadingData = action.payload
    },
    toggleSensorSelection: (state, action: PayloadAction<Sensor>) => {
      state.sensorCollection.map((sensor) => {
        if (sensor.ref === action.payload.ref) {
          sensor.selected = !sensor.selected
        }
        return sensor
      })
    },
    setSelectedSensors: (state, action: PayloadAction<Sensor[]>) => {
      const sensorsToSelect = action.payload
      state.sensorCollection = state.sensorCollection.map((sensor) => {
        sensor.selected = !!sensorsToSelect.find(
          ({ ref }) => sensor.ref === ref
        )
        return sensor
      })
    },
    setDatasetVisibility: (state, action) => {
      state.datasetVisibility = action.payload
    },
    toggleDatasetVisibility: (state, action: PayloadAction<string>) => {
      const dataset = action.payload
      state.datasetVisibility[dataset] = !state.datasetVisibility[dataset]
    },
  },
})

export default CFSlice.reducer

export const {
  toggleDatasetVisibility,
  loadDatasets,
  setMultiSources,
  setMultiSourceTracks,
  setMultiSourceRefs,
  setMultiSourceTrackCombinations,
  setUpdateNeededTrigger,
  updateMultiSourceTrackCombinationsForModality,
  updateMultiSourceTrackCombinations,
  setMultiSourceTracksViewType,
  setDatasetVisibility,
  removeTimePeriod,
  setLoadingData,
  setBasePopulationSensorRef,
  addTimePeriod,
  setSelectedSensors,
  toggleSensorSelection,
  alterTimePeriod,
} = CFSlice.actions
