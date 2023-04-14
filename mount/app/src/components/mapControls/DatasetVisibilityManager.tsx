import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import {
  selectDatasets,
  selectDatasetVisibility,
  toggleDatasetVisibility,
} from '../../store/CFState'
import { useAppDispatch } from '../../hooks'

export function DatasetVisibilityManager() {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()

  const datasets = useSelector(selectDatasets)
  const datasetVisibility = useSelector(selectDatasetVisibility)

  return (
    <div className="datasetsSelector">
      <h4 className="mb-2">{t('datasets.showOrHideDatasets')}</h4>
      {datasets.map((dataset) => (
        <div key={'selector' + dataset}>
          <label
            className="dsselector"
            htmlFor={'dsselector' + dataset}
            onClick={() => dispatch(toggleDatasetVisibility(dataset))}
          >
            {datasetVisibility[dataset] ? (
              <AiFillEye size={16} color={'#3388FF'} />
            ) : (
              <AiOutlineEyeInvisible size={16} color={'#FF445A'} />
            )}
            {dataset}
          </label>
        </div>
      ))}
    </div>
  )
}
