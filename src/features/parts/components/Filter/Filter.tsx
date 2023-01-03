import { FC } from 'react'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'
import { ContentLayout as Content } from '../ContentLayout/ContentLayout'
import { LowerBox } from './components/LowerBox'
import { UpperBox } from './components/UpperBox'

const Box = styled(Content)`
  z-index: ${ElementDepth.parts.category};
  padding: 20px;
  gap: 20px;

  /* On mobile, second component which is Filter has drop-shadow
     if all the card components have the same z-index, this shadow will be hidden
     thus, increase the z-index of Filter component */
  ${media.mobile`
    z-index: ${ElementDepth.parts.category + 1};
    padding: 0 12px 12px 12px;
  `}
`

export const Filter: FC = () => {
  return (
    <Box>
      <UpperBox />
      <LowerBox />
    </Box>
  )
}
