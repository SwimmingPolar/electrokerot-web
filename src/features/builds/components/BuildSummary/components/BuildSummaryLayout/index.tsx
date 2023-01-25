import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import FilterNoneOutlinedIcon from '@mui/icons-material/FilterNoneOutlined'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from 'styled-components'

const Box = styled.div`
  display: flex;
  width: 100%;
  padding: 0 25px 25px 25px;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 68px;
  gap: 24px;
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
  }
`

const Section = styled.section`
  gap: 7px;
`

type BuildSummaryLayoutProps = {
  children: JSX.Element
}

export const BuildSummaryLayout = ({ children }: BuildSummaryLayoutProps) => {
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
              <CreateOutlinedIcon
                sx={{
                  fontSize: '28px'
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="견적 삭제" arrow>
            <IconButton>
              <DeleteForeverOutlinedIcon
                sx={{
                  fontSize: '28px'
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="견적 변경" arrow>
            <IconButton>
              <FilterNoneOutlinedIcon
                sx={{
                  fontSize: '24px'
                }}
              />
            </IconButton>
          </Tooltip>
        </ButtonsBox>
      </Header>
      {/* Section */}
      <Section>{children}</Section>
    </Box>
  )
}
