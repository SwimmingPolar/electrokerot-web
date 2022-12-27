import { ContentLayout as Content } from '../ContentLayout/ContentLayout'
import { FC } from 'react'
import styled from 'styled-components'
import { ElementDepth } from 'styles'

const Box = styled(Content)`
  z-index: ${ElementDepth.parts.category};
  height: 1500px;
`

export const PartList: FC = () => {
  return <Box></Box>
}
