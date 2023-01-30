import CloseIcon from '@mui/icons-material/Close'
import { useDeviceDetect, useScrollbarWidth } from 'hooks'
import styled from 'styled-components'

// Layout
const Box = styled.div<{ isMobileFriendly: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  overflow: hidden;
  border-radius: 7px;
  /* On mobile devices, make the width and height fill the viewport */
  ${({ isMobileFriendly }) =>
    isMobileFriendly
      ? `
    width: 100%;
    height: 100%;
    border-radius: 0;
  `
      : ''}

  button[tabIndex='0'].close:focus-visible {
    background-color: #cdcdcd;
  }
  button[tabIndex='0'].confirm:focus-visible {
    background-color: #81c5ff;
  }
`

const ScrollBox = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  position: relative;
`

const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary200};
  position: relative;
  padding-bottom: 45px;

  h3 {
    font-size: 24px;
  }

  .icon {
    cursor: pointer;
    position: absolute;
    right: 12px;
  }
`

// Content
const ContentBox = styled.div<{ scrollbarWidth: number }>`
  display: flex;
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
  margin-right: ${({ scrollbarWidth }) => -scrollbarWidth * 2}px;
  flex-direction: row;
  position: relative;
`

// Buttons
const ButtonBox = styled.div<{ isMobileFriendly: boolean }>`
  display: flex;
  flex-direction: row;
  position: sticky;
  bottom: 0;
  width: 100%;
  z-index: 9999;
  ${({ isMobileFriendly }) =>
    isMobileFriendly
      ? ''
      : `box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
  rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;`}

  button {
    flex: 1;
    cursor: pointer;
    height: 54px;
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-size: 25px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.white};
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const CloseButton = styled.button`
  background-color: ${({ theme }) => theme.colors.closeButton};
`

const ConfirmButton = styled.button`
  background-color: ${({ theme }) => theme.colors.confirmButton};
`

type PopupLayoutType = {
  children?: React.ReactNode
  title?: string
  onClose?: () => void
  onConfirm?: () => void
  closeButtonName?: string
  confirmButtonName?: string
}

export const PopupLayout = ({
  children,
  title,
  onClose,
  onConfirm,
  closeButtonName,
  confirmButtonName
}: PopupLayoutType) => {
  const scrollbarWidth = useScrollbarWidth()
  const { isMobileFriendly } = useDeviceDetect()

  return (
    <Box isMobileFriendly={isMobileFriendly}>
      <ScrollBox>
        {/* Show title only if they exist */}
        {title ? (
          <TitleBox>
            <h3>{title}</h3>
            <button className="icon" onClick={onClose}>
              <CloseIcon />
            </button>
          </TitleBox>
        ) : null}
        {/* Render content inside ContentBox */}
        <ContentBox scrollbarWidth={scrollbarWidth}>{children}</ContentBox>
        <ButtonBox isMobileFriendly={isMobileFriendly}>
          <CloseButton onClick={onClose} tabIndex={0} className="close">
            {closeButtonName || '닫기'}
          </CloseButton>
          <ConfirmButton onClick={onConfirm} tabIndex={0} className="confirm">
            {confirmButtonName || '확인'}
          </ConfirmButton>
        </ButtonBox>
      </ScrollBox>
    </Box>
  )
}
