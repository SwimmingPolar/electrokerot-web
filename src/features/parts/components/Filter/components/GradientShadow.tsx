import styled from 'styled-components'

type GradientShadowType = {
  hasOverflow: boolean
  isScrollAtStart: boolean
  isScrollAtEnd: boolean
  direction: 'left' | 'right'
}

const Box = styled.div<GradientShadowType>`
  position: absolute;
  width: 30px;
  height: 100%;
  z-index: 99999;
  pointer-events: none;

  ${({ hasOverflow, isScrollAtStart, isScrollAtEnd, direction }) => {
    if (!hasOverflow) {
      return 'none;'
    }

    switch (direction) {
      case 'left':
        // If the scroll is at start, do not show the shadow
        if (isScrollAtStart) {
          return {}
        }
        return {
          left: 0,
          background: 'linear-gradient(to left, rgba(255, 255, 255, 0), #fff)'
        }
      case 'right':
        // If the scroll is at end, do not show the shadow
        if (isScrollAtEnd) {
          return {}
        }
        return {
          right: 0,
          background: 'linear-gradient(to right, rgba(255, 255, 255, 0), #fff)'
        }
    }
  }};
`

export const GradientShadow = (props: GradientShadowType) => {
  return <Box {...props} />
}
