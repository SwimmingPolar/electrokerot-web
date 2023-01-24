import styled from 'styled-components'

const Box = styled.footer`
  display: flex;
  width: 100%;
  height: 54px;
  background-color: ${({ theme }) => theme.colors.white};
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2));
  justify-content: center;
  align-items: center;
`

const NavigationBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  button {
    color: ${({ theme }) => theme.colors.gray400};
  }
`

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  line-height: 17px;
  font-family: ${({ theme }) => theme.fonts.primary};
  width: 48px;
  height: 36px;
  border-radius: 3px;
  transition: color 0.2s ease-in-out;

  :hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const Pages = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  > button {
    font-weight: 700;

    &:first-of-type {
      color: ${({ theme }) => theme.colors.primary};
      border: 1px solid ${({ theme }) => theme.colors.primary};
    }
  }
`

export const TableFooter = () => {
  const pages = [1, 2, 3, 4, 5]

  return (
    <Box>
      <NavigationBox>
        <Button className="navigation">
          <span>이전</span>
        </Button>
        <Pages>
          {pages.map((page, index) => (
            <Button key={index} className="page">
              {page}
            </Button>
          ))}
        </Pages>
        <Button className="navigation">
          <span>다음</span>
        </Button>
      </NavigationBox>
    </Box>
  )
}
