const Cache = new Map()

type ExtendedPromise<T> = Promise<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected'
  reason?: any
  value?: T
}

// @Important:
// https://github.com/facebook/react/issues/17526
// Details about Suspense enabled cache in React
// In a nutshell, the cache should return the exact same promise
// To achieve this, we need to cache the promise by the unique key

export function promiseGuard<T>(key: any, promise: ExtendedPromise<T>) {
  // Retrieve the promise from cache if it exists
  if (Cache.has(key)) {
    promise = Cache.get(key)
  }

  if (promise.status === 'fulfilled') {
    return promise.value
  } else if (promise.status === 'rejected') {
    throw promise.reason
  } else if (promise.status === 'pending') {
    throw promise
  } else {
    Cache.set(key, promise)
    promise.status = 'pending'

    promise.then(
      result => {
        promise.status = 'fulfilled'
        promise.value = result
      },
      reason => {
        promise.status = 'rejected'
        promise.reason = reason
      }
    )

    throw promise
  }
}
