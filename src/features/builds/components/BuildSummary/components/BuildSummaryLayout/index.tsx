import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import FilterNoneOutlinedIcon from '@mui/icons-material/FilterNoneOutlined'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useMemo } from 'react'
import styled from 'styled-components'
import { media } from 'styles'

const Box = styled.div`
  display: flex;
  width: 100%;
  padding: 0 25px 25px 25px;
  position: relative;

  ${media.desktopSmall`
    padding: 0 15px 15px 15px;
  `}
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

type BuildSummaryLayoutProps = {
  children: JSX.Element
}

export const BuildSummaryLayout = ({ children }: BuildSummaryLayoutProps) => {
  const styles = useMemo(
    () => ({
      edit: {
        fontSize: '28px'
      },
      delete: {
        fontSize: '28px'
      },
      change: {
        fontSize: '24px'
      }
    }),
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
        <ButtonsBox>
          <Tooltip title="이름 수정" arrow>
            <IconButton>
              <CreateOutlinedIcon sx={styles.edit} />
            </IconButton>
          </Tooltip>
          <Tooltip title="견적 삭제" arrow>
            <IconButton>
              <DeleteForeverOutlinedIcon sx={styles.delete} />
            </IconButton>
          </Tooltip>
          <Tooltip title="견적 변경" arrow>
            <IconButton>
              <FilterNoneOutlinedIcon sx={styles.change} />
            </IconButton>
          </Tooltip>
        </ButtonsBox>
      </Header>
      {/* Section */}
      <Section>{children}</Section>
    </Box>
  )
}
