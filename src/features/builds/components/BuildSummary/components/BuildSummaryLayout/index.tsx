import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import FilterNoneOutlinedIcon from '@mui/icons-material/FilterNoneOutlined'
import IconButton from '@mui/material/IconButton'
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip'
import { useMemo } from 'react'
import styled from 'styled-components'
import { media } from 'styles'

const Box = styled.div`
  display: flex;
  width: 100%;
  padding: 0 20px 20px 20px;
  position: relative;

  ${media.desktopSmall`
    padding: 0 15px 15px 15px;
  `}

  .MuiTooltip-tooltip {
    background-color: red;
    color: blue;
  }
  .MuiTooltip-tooltipArrow {
    background-color: red;
    color: blue;
  }
  .MuiTooltip-arrow {
    background-color: red;
    color: blue;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 68px;
  gap: 18px;
`

const BuildTitleBox = styled.div`
  h3 {
    font-size: 28px;
    font-weight: 700;
    font-family: ${({ theme }) => theme.fonts.primary};
    color: ${({ theme }) => theme.colors.primary};
    pointer-events: none;
  }
`

const ButtonsBox = styled.div`
  display: flex;
  flex-direction: row;

  button {
    cursor: pointer;
    width: 38px;
    height: 38px;
    padding: 3px 2px;
    color: ${({ theme }) => theme.colors.gray300};
    transition: color 0.125s ease-in-out;

    :hover {
      color: ${({ theme }) => theme.colors.primary};
    }

    &:not(:first-of-type) {
      margin-left: -7px;
    }
  }
`

const Section = styled.section`
  gap: 7px;
`

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: 'black'
  }
}))

type BuildSummaryLayoutProps = {
  children: JSX.Element
}

export const BuildSummaryLayout = ({ children }: BuildSummaryLayoutProps) => {
  const miniButtons = useMemo(
    () => ({
      edit: {
        name: '이름 수정',
        style: {
          fontSize: '28px'
        },
        icon: CreateOutlinedIcon
      },
      delete: {
        name: '견적 삭제',
        style: {
          fontSize: '28px'
        },
        icon: DeleteForeverOutlinedIcon
      },
      change: {
        name: '견적 변경',
        style: {
          fontSize: '24px'
        },
        icon: FilterNoneOutlinedIcon
      }
    }),
    []
  )

  const MiniButtons = useMemo(
    () =>
      Object.values(miniButtons).map(({ name, style, icon: Icon }, index) => (
        <CustomTooltip title={name} arrow key={index}>
          <IconButton tabIndex={0}>
            <Icon sx={style} />
          </IconButton>
        </CustomTooltip>
      )),
    []
  )

  return (
    <Box>
      <Header>
        {/* Build Title */}
        <BuildTitleBox>
          <h3>Build #1</h3>
        </BuildTitleBox>
        {/* Buttons */}
        <ButtonsBox>{MiniButtons}</ButtonsBox>
      </Header>
      {/* Section */}
      <Section>{children}</Section>
    </Box>
  )
}
