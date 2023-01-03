import { Gap } from 'constant'
import styled from 'styled-components'
import { media } from 'styles'

export const ContentLayout = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.primary100};
  border-radius: 2px;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.07);
  background-color: ${({ theme }) => theme.colors.white};
  margin: 0;

  ${media.mobile`
    border: none;
    border-radius: 0;
    box-shadow: none;
  `}

  :first-of-type {
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    margin-top: 0;

    ${media.mobile`
      border-radius: 0;
    `}
    ${media.desktop`
      margin-top: ${Gap.desktop + 'px'};
    `}
    ${media.tablet`
      margin-top: ${Gap.tablet + 'px'};
    `}
  }
  :nth-of-type(2) {
    ${media.mobile`
      border: none;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
    `}
  }
  :last-of-type {
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
    ${media.desktop`
      margin-bottom: ${Gap.desktop + 'px'};
    `}
    ${media.tablet`
      margin-bottom: ${Gap.tablet + 'px'};
    `}
  }

  ${media.tablet`
    margin: 0 ${Gap.tablet + 'px'}};
  `}
  ${media.desktop`
    margin: 0 ${Gap.desktop + 'px'}};
  `}
`
