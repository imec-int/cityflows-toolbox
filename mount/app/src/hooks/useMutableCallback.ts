import { DependencyList, useCallback, useEffect, useRef } from 'react'

import { AnyFunction } from '../utils'

/**
 * Returns a memoized callback but allows the user to mutate its implementation
 * without changing the callback reference itself.
 *
 * @example
 * // will memoize the callback even if the value of `someVariable` changes...
 * //  ...but when it does, the callback implementation itself *will* be updated
 * const myCallback = useMutableCallback(
 *   () => console.log(someVariable),
 *   [someVariable],
 * )
 *
 * This hook is useful when you need to memoize a callback reference but
 * want to avoid stale references inside said callback.
 *
 * Please note that this is considered an 'escape hatch'. According to React
 * documentation, the use case for this is very rare and should be avoided.
 *
 * This code has been adapted from React's FAQ page:
 * https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
 *
 * @param callback the function to be memoized
 * @param deps list of dependencies (references used inside the callback that
 *  should be kept 'fresh')
 * @returns {function(...[*]): *}
 */
export function useMutableCallback<T extends AnyFunction>(
  callback: T,
  deps: DependencyList = []
): T {
  const ref = useRef<T>(callback)

  useEffect(() => {
    ref.current = callback
  }, deps)

  return useCallback(
    (...args: Parameters<T>) => ref.current(...args),
    [ref]
  ) as unknown as T
}
