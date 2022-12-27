import { AnimationProps, motion } from 'framer-motion'
import { useDeviceDetect, useUnsetIsDirectAccess } from 'hooks'
import styled from 'styled-components'
import { media } from 'styles'
import { useCloseModalOnUnmount } from '../ModalLayout/useOpenModalOnMount'

export const variants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
} as AnimationProps

const StyledModalBackdrop = styled(motion.div)`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.45);
  /* mui modal's z-index value is 1300
  maintain z-index of backdrop just below that value */
  z-index: 99999;

  ${media.device('mobile', 'foldable')`
    display: none;
  `}
`

export const DummyDiv = () => (
  <motion.div {...variants} style={{ display: 'none' }} />
)

export const ModalBackdrop = () => {
  // unset all modal states on unmount, and remove last pathname
  useCloseModalOnUnmount()
  // unset isDirectAccess on unmount if modal was opened directly via url
  useUnsetIsDirectAccess()

  let backdropVariants = Object.assign({}, variants)
  const { isMobileFriendly } = useDeviceDetect()

  if (isMobileFriendly) {
    // Remove backdrop variants for mobile devices
    backdropVariants = {
      transition: {
        duration: 0
      }
    }
  }

  return <StyledModalBackdrop {...backdropVariants} data-cy="modal-backdrop" />
}
