import { ModalClassName } from 'constant'
import { useIsPresent } from 'framer-motion'
import { useEffect } from 'react'

export const useEnableEscapeKey = (onClose: (...args: any[]) => void) => {
  const isPresent = useIsPresent()

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      // Only close the modal when the escape key is pressed
      if (event.key !== 'Escape') {
        return
      }
      event && event.preventDefault()

      // Prevent the modal from closing when it's animating
      const modals = Array.from(document.querySelectorAll(ModalClassName) || [])
      const isAnimating = modals.length > 1
      if (isAnimating) {
        return
      }

      // Make sure the modal is present before closing it
      if (!isPresent) {
        return
      }

      // Close the modal
      onClose()
    }

    window.addEventListener('keydown', handleEscapeKey)
    return () => {
      window.removeEventListener('keydown', handleEscapeKey)
    }
  }, [onClose, isPresent])
}
