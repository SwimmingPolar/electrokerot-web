import CloseIcon from '@mui/icons-material/Close'
import { Modal } from '@mui/material'
import { Navbar, navbarProps } from 'components'
import { ModalClassName } from 'constant'
import { AnimationProps, motion } from 'framer-motion'
import { useDeviceDetect, useModal } from 'hooks'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { media } from 'styles'
import { ModalRoutesType } from 'constant'

const ModalBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  /* hide navbar on all devices */
  .navbar {
    display: none;
  }

  /* show navbar on mobile and foldable */
  .navbar {
    ${media.device('mobile', 'foldable')`
      display: flex
    `}
  }
`

const Section = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const Content = styled(motion.div)`
  display: flex;
  flex-direction: row;
  width: 450px;
  height: 650px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 0px 20px 7px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  .close-button {
    display: flex;
    justify-content: center;
    cursor: pointer;
    position: absolute;
    top: 22px;
    right: 20px;

    ${media.device('mobile', 'foldable')`
      display: none;
  `}

    :focus-visible {
      outline: 2px solid black;
    }
  }

  ${media.device('mobile', 'foldable')`
    width: 100%;
    height: 100%;
    border-radius: 0;

    opacity: 1 !important;
    transform: none !important;
    transition: none 0 !important;

    box-shadow: none !important;
  `}
`

type ModalProps = {
  handleExitMotion: (pathname: string) => void
  motion: AnimationProps
}

type ModalLayoutProps = {
  modal: (props: ModalProps) => React.ReactNode
  pathname: ModalRoutesType
}

export const ModalLayout = ({ modal, pathname }: ModalLayoutProps) => {
  const {
    open,
    onClose,
    motion: modalMotion,
    handleExitMotion,
    modalRef
  } = useModal(pathname)

  // Get current device type based on viewport width
  const { isMobileFriendly } = useDeviceDetect()

  return (
    <Modal
      open={open}
      onClose={onClose}
      ref={modalRef}
      tabIndex={-1}
      hideBackdrop
      disableScrollLock
      // Disable default escape key behavior
      disableEscapeKeyDown
      // remove dot(.) from modal class name constant
      className={ModalClassName.replace(/^\.{1}/, '')}
      data-cy={pathname}
    >
      <ModalBox>
        <Main>
          {/* Show navbar on mobile friendly devices only */}
          {/* @Issue: */}
          {/* This motion.div is needed to sustain MUI Drawer's closing motion.
              When navigating AWAY from the modal pages, Navbar component INSIDE
              ModalLayout component will be unmounted instantly leaving MUI Drawer
              no chance to show closing animation.
              The DRAWBACK of this workaround to show closing animation of the menu
              drawer is that the page doesn't change until transition duration finishes
              when navigating AWAY from modal pages whether or not the drawer is opened or closed. */}
          {isMobileFriendly ? (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{
                // should have same value to MUI Drawer's transition duration in Menu component
                duration: 0.15
              }}
            >
              <Navbar {...navbarProps} fullWidth={true} />
            </motion.div>
          ) : null}
          <Section>
            <Content {...modalMotion}>
              {/* Modal Component */}
              {modal({ handleExitMotion, motion: modalMotion })}
              {/* Close button for the modal */}
              <button
                className="close-button"
                onClick={onClose}
                tabIndex={0}
                data-cy="close-button"
              >
                <CloseIcon />
              </button>
            </Content>
          </Section>
        </Main>
      </ModalBox>
    </Modal>
  )
}
