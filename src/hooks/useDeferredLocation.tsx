import { PartsCategoriesKr } from 'constant'
import { useEffect, useState, useTransition } from 'react'
import { useLocation } from 'react-router-dom'

const DeferredRoutes = ([] as string[])
  // Concat all parts categories to DeferredRoutes (/parts/:category)
  .concat(Object.keys(PartsCategoriesKr).map(category => `/parts/${category}`))

export const useDeferredLocation = () => {
  const location = useLocation()
  const [newLocation, setNewLocation] = useState(location)
  const [isPending, startTransition] = useTransition()

  const shouldDeferRendering =
    // Defer rendering only when the user is navigating to a deferred route
    DeferredRoutes.includes(location.pathname)

  useEffect(() => {
    // When the user is navigating to a deferred route, mark the update as transition
    if (shouldDeferRendering) {
      startTransition(() => {
        setNewLocation(location)
      })
    }
    // Else, normal update which will not be deferred
    else {
      setNewLocation(location)
    }
  }, [location])

  return {
    location: shouldDeferRendering ? newLocation : location,
    isPending: shouldDeferRendering && isPending
  }
}
