import { Button } from '@mui/material'
import styled from 'styled-components'
import { media } from 'styles'

const FooterBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  position: sticky;
  bottom: 0;

  > div {
    flex: 1;
    height: 65px;
  }

  span {
    font-size: 28px;
    font-family: ${({ theme }) => theme.fonts.primary};
  }

  .total-price {
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    background-color: ${({ theme }) => theme.colors.white};
    border-top: 1px solid ${({ theme }) => theme.colors.primary200};
    span {
      font-weight: 600;
    }
  }
  .go-to-build {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.info};
    border-top: 1px solid ${({ theme }) => theme.colors.info};
    span {
      font-weight: 800;
      color: ${({ theme }) => theme.colors.white};
    }

    button {
      width: 100%;
      height: 100%;
    }
  }

  ${media.desktopSmall`
    span {
      font-size: 24px;
    }
  `}
`

export const BuildSummaryFooter = () => {
  return (
    <FooterBox>
      <div className="total-price">
        <span>1,234,567원</span>
      </div>
      <div className="go-to-build">
        <Button variant="text">
          <span>견적서</span>
        </Button>
      </div>
    </FooterBox>
  )
}