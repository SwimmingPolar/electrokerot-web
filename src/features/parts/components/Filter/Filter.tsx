import { ContentLayout as Content } from '../ContentLayout/ContentLayout'
import { FC } from 'react'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'

const Box = styled(Content)`
  z-index: ${ElementDepth.parts.category};
  height: 206px;

  ${media.mobile`
    height: 46px;
  `}
  ${media.tablet`
    height: 200px;
  `}
  /* On mobile, second component which is Filter has drop-shadow
     if all the card components have the same z-index, this shadow will be hidden
     thus, increase the z-index of Filter component */
  ${media.mobile`
    z-index: ${ElementDepth.parts.category + 1};
  `}
`

export const Filter: FC = () => {
  return <Box></Box>
}
