import { Button } from '@mui/material'
import { Link as NavLink } from 'components'
import { CategoryNavigationSidebarWidth, NavbarHeight } from 'constant'
import styled from 'styled-components'
import { media } from 'styles'
import { ElementDepth } from 'styles'

const Box = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  position: sticky;
  bottom: 0;
  z-index: ${ElementDepth.parts.buildSummary + 1};

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

    a {
      width: 100%;
      height: 100%;
    }

    button {
      width: 100%;
      height: 100%;
    }

    :has(a:focus-visible) {
      border-top: 1px solid #81c5ff;
    }
  }

  ${media.desktopSmall`
    span {
      font-size: 24px;
    }
  `}

  /* From here, styles for sidebar on tablet and mobile  */

  /* For MOBILE */
  ${media.device('mobile', 'foldable')`
    width: ${CategoryNavigationSidebarWidth.mobile + 'px'};

    > div {
      height: 50px;
    }

    .total-price {
      span {
        font-size: 12px;
      }
    }
    .go-to-build {
      span {
        font-size: 16px;
        font-weight: 900;
      }
    }
    

    /*  On mobile, the sidebar is pushed from the top
        to make room for the navbar. This will push the sticky element down
        as much as the height of the navbar. So, we need to push the footer
        up by the same amount.
    */
    bottom: ${NavbarHeight + 'px'};
  `}
  
  /* For TABLET */
  ${media.tablet`
    width: ${CategoryNavigationSidebarWidth.tablet + 'px'};

    > div {
      height: 62px;
    }

    .total-price {
      span {
        font-size: 14px;
      }
    }

    .go-to-build {
      span {
        font-size: 20px;
      }
    }
      
  `}

  /* For common styles */
  ${media.device('mobile', 'foldable', 'tablet')`
    flex-direction: column;
    
    > div {
      flex: none;
    }

    .total-price {
      order: 2;
      background-color: ${({ theme }) => theme.colors.primary200};
    }
    
    .go-to-build {
      order: 1;
    }
  `}

  a:focus-visible {
    outline: none;
    background-color: #81c5ff;

    button {
      background-color: #81c5ff;
    }
  }
`

export const BuildSummaryFooter = () => {
  return (
    <Box>
      <div className="total-price">
        <span>1,234,567원</span>
      </div>
      <div className="go-to-build">
        <NavLink to="/builds" tabIndex={0}>
          <Button variant="text" focusRipple={false} tabIndex={-1}>
            <span>견적서</span>
          </Button>
        </NavLink>
      </div>
    </Box>
  )
}
