import styled from 'styled-components'
import CloseIcon from '@mui/icons-material/Close'
import { useScrollbarWidth } from 'hooks'

// Layout
const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
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
  margin-right: ${({ scrollbarWidth }) => -scrollbarWidth}px;
`

// Buttons
const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  position: sticky;
  bottom: 0;
  width: 100%;

  button {
    flex: 1;
    cursor: pointer;
    height: 45px;
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

  return (
    <Box>
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
      <ButtonBox>
        <CloseButton onClick={onClose}>{closeButtonName || '닫기'}</CloseButton>
        <ConfirmButton onClick={onConfirm}>
          {confirmButtonName || '확인'}
        </ConfirmButton>
      </ButtonBox>
    </Box>
  )
}
