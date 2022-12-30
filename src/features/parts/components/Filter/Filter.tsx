import styled from 'styled-components'
import { ElementDepth, media } from 'styles'
import { ContentLayout as Content } from '../ContentLayout/ContentLayout'
import { UpperBox } from './components/UpperBox'
import { LowerBox } from './components/LowerBox'

const Box = styled(Content)`
  z-index: ${ElementDepth.parts.category};
  padding: 20px;
  gap: 20px;

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

export const Filter = () => {
  return (
    <Box>
      <UpperBox />
      <LowerBox />
    </Box>
  )
}
