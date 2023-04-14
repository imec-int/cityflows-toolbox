// TODO: use Chart.js types

import { GeoJSON } from 'geojson'

import { InvalidPointGeometry, SensorMetaMap } from '../../utils'

export type SourceTracks = { contents: ContentItem[] }

export type Modality = 'Bike' | 'Car' | 'Pedestrian'

export type Sensor = {
  ref: string
  hasReverse: boolean
  selected: boolean | undefined
  modalities: Modality[]
  location: InvalidPointGeometry | GeoJSON
  extraFields: {
    addressString: string
  }
  sensorType: {
    name: string
  }
}

export enum TrackViewType {
  Summary = 'Summary',
  SensorsSplit = 'Sensors split',
  DailyProfiles = 'Daily Profiles',
  TrendAnalysis = 'Trend analysis',
  DailyLevelDifferences = 'Difference on a daily level',
  SingleTrackExtrapolation = 'Single track extrapolation',
  MultipleTracksExtrapolation = 'Multiple tracks extrapolation',
}

export type ModalityCombination = Record<Modality, Record<string, boolean>>

export type ModalityReverseCombinations = Record<
  string, // sensor ref
  ModalityCombination
>

export type TimePeriod = {
  from: number
  to: number
  Monday: boolean
  Tuesday: boolean
  Wednesday: boolean
  Thursday: boolean
  Friday: boolean
  Saturday: boolean
  Sunday: boolean
  Holiday: boolean
  'Non-holiday': boolean
  DBSCAN: boolean
  MinThreshold: boolean
  PerformanceThreshold: boolean
}

export type TimePeriodFromJSON = {
  from: string
  to: string
  Monday: boolean
  Tuesday: boolean
  Wednesday: boolean
  Thursday: boolean
  Friday: boolean
  Saturday: boolean
  Sunday: boolean
  Holiday: boolean
  'Non-holiday': boolean
  DBSCAN: boolean
  MinThreshold: boolean
  PerformanceThreshold: boolean
}

export type DatasetVisibility = { [key: string]: boolean }

type ContentItemBase = {
  title: string
  subtitle?: string
  collapsed?: boolean
  isError?: boolean
}

export type ListContentItem = ContentItemBase & {
  type: 'list'
  children: ContentItem[]
}

export type SelectableContentItem = ContentItemBase & {
  type: 'selectable'
  children?: Array<{
    label: string
    item: ContentItem
  }>
}

export type MapContentItem = ContentItemBase & {
  type: 'map'
  meta: SensorMetaMap
}

export type ChartLine = {
  data: { x: string | number; y: string | number }
  label: string
  colorCounter: number
  timePeriodCounter: number
}

export type ChartContentItem = ContentItemBase & {
  type: 'lineChart' | 'scatterChart'
  lines: Array<ChartLine>
  xAxisType: string
}

export type TextContentItem = ContentItemBase & {
  type: 'text'
}

export type TableLine = string[][]

export type TableContentItem = ContentItemBase & {
  type: 'table'
  lines: TableLine[]
  captions: string[]
}

export type ContentItem =
  | ListContentItem
  | SelectableContentItem
  | MapContentItem
  | ChartContentItem
  | TableContentItem
