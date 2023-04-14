import { TimePeriod } from '../store/CFState'

/**
 * Creates a new TimePeriod with all settings enabled.
 * The initial dates are between (dd/mm/yyyy) 01/09/2021 and 31/12/2021.
 *
 * To customize the values, simply pass a partial TimePeriod with the overrides.
 * @param customValues
 * @constructor
 */
export function CreateTimePeriod(
  customValues?: Partial<TimePeriod>
): TimePeriod {
  // TODO: these initial dates are pre-selected
  //  we should make this more generic for future applications
  return {
    from: Date.parse('2021-09-01T00:00:00.000Z'),
    to: Date.parse('2021-12-31T00:00:00.000Z'),
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: true,
    Holiday: true,
    'Non-holiday': true,
    DBSCAN: true,
    MinThreshold: true,
    PerformanceThreshold: true,
    ...customValues,
  }
}
