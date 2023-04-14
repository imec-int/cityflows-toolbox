// @ts-nocheck
import React, { Component, ReactNode } from 'react'
import camelCase from 'lodash.camelcase'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Tab from 'react-bootstrap/Tab'

import { BiArrowBack } from 'react-icons/bi'
import { BsCalendarWeek } from 'react-icons/bs'
import { AiOutlineMinusCircle } from 'react-icons/ai'
import Accordion from 'react-bootstrap/Accordion'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'chartjs-adapter-moment'

import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartDataset,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Line, Scatter } from 'react-chartjs-2'
import { ReactComponent as CarIcon } from '../../img/car.svg'
import { ReactComponent as BikeIcon } from '../../img/bike.svg'
import { ReactComponent as PedestrianIcon } from '../../img/people.svg'
import { SelectedSensorsMap } from '../SelectedSensorsMap'
import {
  ChartLine,
  ContentItem,
  SelectableItemTabs,
  TableContentItem,
} from './SelectableItemTabs'
import {
  addTimePeriod,
  alterTimePeriod,
  getMultiSensorTrack,
  getRawCSVData,
  removeTimePeriod,
  setBasePopulationSensorRef,
  setMultiSourceRefs,
  setMultiSourceTracksViewType,
  setUpdateNeededTrigger,
  TrackViewType,
  updateMultiSourceTrackCombinations,
  updateMultiSourceTrackCombinationsForModality,
} from '../../store/CFState'
import { WithTranslation, withTranslation } from 'react-i18next'

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const iconNameToIcon = {
  Car: <CarIcon />,
  Bike: <BikeIcon size={24} />,
  Pedestrian: <PedestrianIcon size={24} />,
  Background: <span>&#8721;</span>,
}
const COLOR_PALETTE = [
  '#e6194b',
  '#3cb44b',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#9a6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000075',
  '#808080',
  '#ffffff',
  '#000000',
]

const DASH_STYLES = [[], [5, 5], [2, 5], [5, 2, 2, 2], [1, 1]]

const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

// adds typescript support i18n
// TODO: type remaining props
interface IProps extends WithTranslation {}

class MultiSource extends Component<IProps> {
  componentDidUpdate() {
    const that = this
    if (!this.props.cfState.isLoadingData) {
      if (this.props.cfState.needUpdateMultiTrack) {
        this.props.dispatch(setUpdateNeededTrigger(false))
        this.props.dispatch(
          getMultiSensorTrack(
            that.props.cfState
              .browsingMultiSourceRefModalityReverseCombinations,
            that.props.cfState.browsingMultiSourceTracksViewType,
            that.props.cfState.selectedTimePeriods,
            that.props.cfState.basePopulationSensorRef
          )
        )
      }
    }
  }

  componentDidMount() {
    this.componentDidUpdate()
    //next line should be removed after debug
    //this.props.dispatch (getSensorCards (this.props.cfState.browsingMultiSourceRefs))
  }

  renderSingleContentItem(
    contentItem: ContentItem,
    contentItemKeyPrefix: string
  ) {
    const that = this
    let cont: ReactNode = null
    if (
      contentItem.type === 'lineChart' ||
      contentItem.type === 'scatterChart'
    ) {
      const options: ChartOptions = {
        responsive: true,
        scales: {
          xAxis: {
            type: contentItem.xAxisType,
          },
        },
        plugins: {
          legend: { position: 'bottom', labels: { boxHeight: 2 } },
        },
      }

      if (contentItem.xAxisStep)
        options["scales"]["xAxis"] = {ticks: { stepSize: contentItem.xAxisStep, autoSkip: false}}
      if (contentItem.yAxisStep)
      {
        options["scales"]["yAxis"] = {ticks: { stepSize: contentItem.yAxisStep, autoSkip: false}}
        if (contentItem.yAxisMin !== null)
        {
          options["scales"]["yAxis"]["ticks"]["min"] = contentItem.yAxisMin
          if (contentItem.yAxisMin === 0)
          {
            options["scales"]["yAxis"]["beginAtZero"] = true
          }
        }
        if (contentItem.yAxisMax)
          options["scales"]["yAxis"]["max"] = contentItem.yAxisMax
      }

      let hasTooltips = false
      const datasets: ChartDataset<'line'>[] = contentItem.lines.map(function (
        ds: ChartLine,
        dsCounter
      ) {
        const dataset: ChartDataset<'line'> = {
          label: ds.label,
          data: ds.data,
          borderColor:
            COLOR_PALETTE[
              (ds.colorCounter !== undefined ? ds.colorCounter : dsCounter) %
                COLOR_PALETTE.length
            ] + '88',
          backgroundColor:
            COLOR_PALETTE[
              (ds.colorCounter !== undefined ? ds.colorCounter : dsCounter) %
                COLOR_PALETTE.length
            ] + '88',
          borderDash:
            DASH_STYLES[
              (ds.timePeriodCounter !== undefined ? ds.timePeriodCounter : 0) %
                DASH_STYLES.length
            ],
        }
        if (ds.fill) dataset['fill'] = ds.fill
        if (ds.pointColors) {
          dataset.pointBorderColor = ds.pointColors
          dataset.pointBackgroundColor = ds.pointColors
        }
        if (ds.tooltips) {
          dataset.tooltips = ds.tooltips
          hasTooltips = true
        }
        if (ds.showLine) {
          dataset.showLine = true
        }
        return dataset
      })

      if (hasTooltips)
        options['plugins']['tooltip'] = {
          callbacks: {
            label: function (tooltipItems) {
              return tooltipItems.dataset.tooltips[tooltipItems.dataIndex]
            },
          },
        }
      const data: ChartData<'line'> = {
        //labels,
        datasets,
      }
      if (contentItem.type === 'lineChart')
        cont = (
          <Line
            key={
              contentItemKeyPrefix +
              that.props.cfState.browsingMultiSourceTracksViewType +
              ' ' +
              that.props.cfState.browsingMultiSourceRefs
            }
            options={options}
            data={data}
          />
        )
      else
        cont = (
          <Scatter
            key={
              contentItemKeyPrefix +
              that.props.cfState.browsingMultiSourceTracksViewType +
              ' ' +
              that.props.cfState.browsingMultiSourceRefs
            }
            options={options}
            data={data}
          />
        )
    }
    if (contentItem.type === 'table') {
      contentItem = contentItem as TableContentItem
      cont = (
        <div>
          <table>
            <thead>
              <tr>
                {contentItem.captions.map(function (caption, iCaption) {
                  return (
                    <th
                      key={
                        'tablecaption' + contentItemKeyPrefix + '_' + iCaption
                      }
                    >
                      {caption}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {contentItem.lines.map(function (line, iLine) {
                return (
                  <tr key={'tableline' + contentItemKeyPrefix + '_' + iLine}>
                    {line.map(function (value, iValue) {
                      return (
                        <td
                          key={
                            'tableelement' +
                            contentItemKeyPrefix +
                            '_' +
                            iLine +
                            '_' +
                            iValue
                          }
                          dangerouslySetInnerHTML={{
                            __html: value,
                          }}
                        ></td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }
    if (contentItem.type === 'map') {
      cont = (
        <SelectedSensorsMap
          style={{
            height: '300px',
          }}
          metaMap={contentItem.meta}
          scrollWheelZoom={false}
          zoomControl={true}
        />
      )
    }
    if (contentItem.type === 'list') {
      cont = contentItem.children.map(function (child, childCounter) {
        return that.renderSingleContentItem(
          child,
          contentItemKeyPrefix + '_' + childCounter
        )
      })
    }
    if (contentItem.type === 'selectable') {
      cont = (
        <SelectableItemTabs
          contentItem={contentItem}
          keyPrefix={contentItemKeyPrefix}
          renderContent={this.renderSingleContentItem.bind(this)}
        />
      )
    }

    var itemBody = <div>
      {contentItem.subtitle ? (
        <p
          className="subtitle"
          dangerouslySetInnerHTML={{
            __html: contentItem.subtitle
          }}
        />
      ) : null}
      {cont}
    </div>
    
    return (
      contentItem.collapsed ? 
        <Accordion.Item
            key={contentItemKeyPrefix}
            className={"trackContentsItem" + (contentItem.isError ? " errored":"")}
            eventKey={contentItemKeyPrefix}
          >
            <Accordion.Header>
              {contentItem.title ? <h4>{contentItem.title}</h4> : null}
            </Accordion.Header>
            <Accordion.Body>
              {itemBody}  
            </Accordion.Body>
        </Accordion.Item>:
        <div 
            key={contentItemKeyPrefix}
            className={"trackContentsItem" + (contentItem.isError ? " errored":"")}
          >
          {contentItem.title ? <h4>{contentItem.title}</h4> : null}
          {itemBody}
        </div>
    )
  }

  render() {
    const { t } = this.props

    if (!this.props.cfState.browsingMultiSourceRefs)
      return <div style={{ display: 'none' }}></div>
    const that = this

    const sensorsByDataset = groupBy(
      this.props.cfState.browsingMultiSources.map((s) => ({
        ...s,
        dataset: s.sensorType.name,
      })),
      'dataset'
    )

    const modalityAvailable = {
      Car: false,
      Bike: false,
      Pedestrian: false,
      Background: false,
    }
    const allSensorsSelectedForModality = {
      Car: true,
      Bike: true,
      Pedestrian: true,
      Background: true,
    }
    for (const cSensor of this.props.cfState.browsingMultiSources) {
      for (const mod of cSensor.modalities) {
        modalityAvailable[mod] = true
        if (
          !that.props.cfState.browsingMultiSourceRefModalityReverseCombinations[
            cSensor.ref
          ][mod][false]
        )
          allSensorsSelectedForModality[mod] = false
        if (
          cSensor.hasReverse &&
          !that.props.cfState.browsingMultiSourceRefModalityReverseCombinations[
            cSensor.ref
          ][mod][true]
        )
          allSensorsSelectedForModality[mod] = false
      }
    }

    return (
      <div className="MultiSourcePage CFPage">
        <Link
          to="/"
          className="backLink"
          onClick={() => {
            this.props.dispatch(setMultiSourceRefs(null))
          }}
        >
          <BiArrowBack size={25} />
        </Link>
        <div className="leftPanel">
          <SelectedSensorsMap />
          <h4>{t('analytics.sidebar.modalities')}</h4>
          <i>{t('analytics.sidebar.selectModalities')}:</i>
          <div className="globalModalitiesToggles">
            {['Bike', 'Car', 'Pedestrian', 'Background'].map(function (
              modality
            ) {
              if (!modalityAvailable[modality]) return null
              return (
                <span key={'btnmod_all_' + modality}>
                  <button
                    className={
                      allSensorsSelectedForModality[modality]
                        ? 'active btn'
                        : 'btn'
                    }
                    onClick={() => {
                      that.props.dispatch(
                        updateMultiSourceTrackCombinationsForModality({
                          modality,
                          value: !allSensorsSelectedForModality[modality],
                        })
                      )
                    }}
                  >
                    {iconNameToIcon[modality]}
                  </button>
                </span>
              )
            })}
          </div>
          <i>{t('analytics.sidebar.choosePerSensor')}:</i>
          <Accordion defaultActiveKey={[]} alwaysOpen>
            {Object.entries(sensorsByDataset).map(
              ([datasetName, sensors], datasetCounter) => {
                return (
                  <Accordion.Item
                    key={'dsAcc' + datasetName}
                    className="datasetAccordionItem"
                    eventKey={datasetCounter}
                  >
                    <Accordion.Header>
                      {sensors.length} {datasetName}
                    </Accordion.Header>
                    <Accordion.Body>
                      {sensors.map(function (sensor) {
                        return (
                          <div
                            key={'sm' + sensor.ref}
                            className={
                              'sensorMeta' +
                              (sensor.hasReverse
                                ? ' withReverseModalities'
                                : '')
                            }
                          >
                            <h4>Sensor ID: {sensor.ref}</h4>
                            {sensor.extraFields?.addressString ? (
                              <h5>{sensor.extraFields.addressString}</h5>
                            ) : null}
                            <h5>{sensor.sensorType.name}</h5>
                            <label
                              className="basePopulationLabel"
                              htmlFor={sensor.ref + '_isBase'}
                              onClick={() => {
                                that.props.dispatch(
                                  setBasePopulationSensorRef(
                                    that.props.cfState
                                      .basePopulationSensorRef === sensor.ref
                                      ? null
                                      : sensor.ref
                                  )
                                )
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  that.props.cfState.basePopulationSensorRef ===
                                  sensor.ref
                                }
                                readOnly={true}
                              ></input>
                              {t('analytics.sidebar.useAsBase')}{' '}
                              <span className="questionMark">
                                ?
                                <div className="hint">{t('analytics.sidebar.useAsBaseHint')}</div>
                              </span>
                            </label>
                            <div className="modalitySelector">
                              {sensor.modalities.map(function (modality) {
                                return (
                                  <React.Fragment
                                    key={
                                      'btnmod_' + sensor.ref + ' ' + modality
                                    }
                                  >
                                    <button
                                      className={
                                        that.props.cfState
                                          .browsingMultiSourceRefModalityReverseCombinations[
                                          sensor.ref
                                        ][modality][false]
                                          ? 'active btn'
                                          : 'btn'
                                      }
                                      onClick={() => {
                                        that.props.dispatch(
                                          updateMultiSourceTrackCombinations({
                                            combination: [
                                              sensor.ref,
                                              modality,
                                              false,
                                            ],
                                            value:
                                              !that.props.cfState
                                                .browsingMultiSourceRefModalityReverseCombinations[
                                                sensor.ref
                                              ][modality][false],
                                          })
                                        )
                                      }}
                                    >
                                      {iconNameToIcon[modality]}
                                    </button>
                                    {sensor.hasReverse ? (
                                      <button
                                        className={
                                          that.props.cfState
                                            .browsingMultiSourceRefModalityReverseCombinations[
                                            sensor.ref
                                          ][modality][true]
                                            ? 'active btn reverseChannelModality'
                                            : 'btn reverseChannelModality'
                                        }
                                        onClick={() => {
                                          that.props.dispatch(
                                            updateMultiSourceTrackCombinations({
                                              combination: [
                                                sensor.ref,
                                                modality,
                                                true,
                                              ],
                                              value:
                                                !that.props.cfState
                                                  .browsingMultiSourceRefModalityReverseCombinations[
                                                  sensor.ref
                                                ][modality][true],
                                            })
                                          )
                                        }}
                                      >
                                        {iconNameToIcon[modality]} &#8617;
                                      </button>
                                    ) : null}
                                  </React.Fragment>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            )}
          </Accordion>
          <div className="temporalConfig">
            <h4>{t('analytics.sidebar.timeWindows')}</h4>
            <p>
              <i>{t('analytics.sidebar.configureTimeWindows')}</i>
            </p>
            <Tab.Container
              id="timeWindowTabs"
              defaultActiveKey="temporalConfigTab0"
            >
              <button
                className="addTimePeriodTabBtn"
                onClick={() => {
                  that.props.dispatch(addTimePeriod())
                }}
              >
                <span className="circled">+</span>
              </button>
              <Nav variant="tabs">
                {that.props.cfState.selectedTimePeriods.map(function (
                  tp,
                  tpCounter
                ) {
                  return (
                    <Nav.Item key={'temporalConfigTab' + tpCounter}>
                      <Nav.Link eventKey={'temporalConfigTab' + tpCounter}>
                        <span
                          className="temporalConfigTabHeader"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%233333' stroke-width='3' stroke-dasharray='" +
                              DASH_STYLES[tpCounter % DASH_STYLES.length].join(
                                ' '
                              ) +
                              "' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")",
                          }}
                        >
                          {tpCounter + 1}
                        </span>
                      </Nav.Link>
                    </Nav.Item>
                  )
                })}
              </Nav>
              <Tab.Content>
                {that.props.cfState.selectedTimePeriods.map(function (
                  selectedTimePeriod,
                  tpCounter
                ) {
                  return (
                    <Tab.Pane
                      key={'timePeriod' + tpCounter}
                      eventKey={'temporalConfigTab' + tpCounter}
                      className="temporalConfigTab"
                    >
                      <div className="dateContainer">
                        <span className="label">{t('common.from')}</span>
                        <DatePicker
                          className="datePickerInput"
                          selected={selectedTimePeriod.from}
                          dateFormat="dd-MM-yyyy"
                          onChange={(date: Date) => {
                            that.props.dispatch(
                              alterTimePeriod({
                                index: tpCounter,
                                changes: { from: date.getTime() },
                              })
                            )
                          }}
                        />
                        <BsCalendarWeek className="datePickerCalendarIcon" />
                      </div>
                      <div className="dateContainer">
                        <span className="label">{t('to')}</span>
                        <DatePicker
                          className="datePickerInput toInput"
                          selected={selectedTimePeriod.to}
                          dateFormat="dd-MM-yyyy"
                          onChange={(date: Date) => {
                            that.props.dispatch(
                              alterTimePeriod({
                                index: tpCounter,
                                changes: { to: date.getTime() },
                              })
                            )
                          }}
                        />
                        <BsCalendarWeek className="datePickerCalendarIcon" />
                      </div>
                      <span className="label">{t('common.days')}</span>
                      {[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                        'Holiday',
                        'Non-holiday',
                      ].map(function (option, dtCounter) {
                        const dayLabel = t(
                          `common.dayOfWeek.${option.toLowerCase()}`
                        )
                        return (
                          <div
                            key={'dt' + dtCounter + '_' + tpCounter}
                            className={'dayType ' + option}
                          >
                            <label
                              htmlFor={'dt' + dtCounter + '_' + tpCounter}
                              onClick={() => {
                                that.props.dispatch(
                                  alterTimePeriod({
                                    index: tpCounter,
                                    changes: {
                                      [option]: !selectedTimePeriod[option],
                                    },
                                  })
                                )
                              }}
                            >
                              {dtCounter < 7 ? dayLabel.substring(0, 3) : ''}
                              <input
                                type="checkbox"
                                checked={selectedTimePeriod[option]}
                                readOnly={true}
                              ></input>
                              {dtCounter >= 7 ? dayLabel : ''}
                            </label>
                          </div>
                        )
                      })}
                      <span className="label">
                        {t('analytics.sidebar.includeDaysNotPassingTests')}:
                      </span>
                      {/* TODO: create component for this duplicate code */}
                      {['DBSCAN', 'MinThreshold', 'PerformanceThreshold'].map(
                        (option, dtCounter) => {
                          return (
                            <div
                              key={'dt' + dtCounter + '_' + tpCounter}
                              className={'dayType ' + option}
                            >
                              <label
                                htmlFor={'dt' + dtCounter + '_' + tpCounter}
                                onClick={() => {
                                  that.props.dispatch(
                                    alterTimePeriod({
                                      index: tpCounter,
                                      changes: {
                                        [option]: !selectedTimePeriod[option],
                                      },
                                    })
                                  )
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedTimePeriod[option]}
                                  readOnly={true}
                                ></input>
                                {option}
                              </label>
                            </div>
                          )
                        }
                      )}
                      <button
                        className="removeTimePeriodBtn"
                        onClick={() => {
                          that.props.dispatch(removeTimePeriod(tpCounter))
                        }}
                      >
                        <AiOutlineMinusCircle />
                        {t('analytics.sidebar.removeTimePeriod')}
                      </button>
                    </Tab.Pane>
                  )
                })}
              </Tab.Content>
            </Tab.Container>

            <button
              className="downloadCSVButton"
              onClick={() => {
                that.props.dispatch(
                  getRawCSVData(
                    that.props.cfState
                      .browsingMultiSourceRefModalityReverseCombinations,
                    that.props.cfState.selectedTimePeriods
                  )
                )
              }}
            >
              {t('analytics.sidebar.downloadRawCsvData')}
            </button>
          </div>
        </div>
        <div className="rightPanel">
          <h2>{t('analytics.dataExploration.title')}</h2>
          {this.props.cfState.browsingMultiSourceTracks ? (
            <div
              className={
                'contents ' +
                this.props.cfState.browsingMultiSourceTracksViewType +
                ' '
              }
            >
              <div className="navTabs">
                {Object.values(TrackViewType).map(function (
                  trackViewType: TrackViewType
                ) {
                  return (
                    <button
                      key={'btnviewtype_' + trackViewType}
                      className={
                        that.props.cfState.browsingMultiSourceTracksViewType ===
                        trackViewType
                          ? 'active btn'
                          : 'btn'
                      }
                      onClick={() => {
                        that.props.dispatch(
                          setMultiSourceTracksViewType(trackViewType)
                        )
                      }}
                    >
                      {t(
                        `analytics.dataExploration.trackViewTypes.${camelCase(
                          trackViewType
                        )}`
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="tabContents">
                <Accordion defaultActiveKey={[]} alwaysOpen>
                  {this.props.cfState.browsingMultiSourceTracks.contents.map(
                    function (d, ic) {
                      return that.renderSingleContentItem(
                        d,
                        'trackContentsItem' + ic + '_'
                      )
                    }
                  )}
                </Accordion>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    cfState: state.cf,
  }
}

export default connect(mapStateToProps)(withTranslation()(MultiSource))
