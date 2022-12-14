import { motion } from 'framer-motion'
import styled from 'styled-components'
import { media } from 'styles'

export const StorybookModalLayout = styled(motion.div)`
  display: flex;
  flex-direction: row;
  width: 450px;
  height: 650px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 0px 20px 7px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  .close-button {
    display: flex;
    justify-content: center;
    cursor: pointer;
    position: absolute;
    top: 22px;
    right: 20px;

    ${media.device('mobile', 'foldable')`
      display: none;
  `}

    :focus-visible {
      outline: 2px solid black;
    }
  }

  ${media.device('mobile', 'foldable')`
    width: 100%;
    height: 100%;
    border-radius: 0;

    opacity: 1 !important;
    transform: none !important;
    transition: none 0 !important;
  `}
`
