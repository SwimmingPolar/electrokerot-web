import { useDeviceDetect } from 'hooks'
import styled from 'styled-components'
import { media } from 'styles'

const Box = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 54px;
  background-color: ${({ theme }) => theme.colors.white};
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2));

  ${media.mobile`
    padding: 0 30px;  
  `}
`

const NavigationBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1;

  button {
    color: ${({ theme }) => theme.colors.gray400};
  }

  ${media.mobile`
    justify-content: space-between;
  `}
`

const Pages = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${media.mobile`
    flex: 1;
  `}
`

const ButtonBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  &:first-of-type {
    > button {
      color: ${({ theme }) => theme.colors.primary};
      border: 1px solid ${({ theme }) => theme.colors.primary};
    }
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

  ${media.mobile`
    width: 36px;
  `}
  ${media.foldable`
    width: 45px;
  `}
`

export const TableFooter = () => {
  const { isMobileFriendly } = useDeviceDetect()
  const pages = [1, 2, 3, 4, 5]

  // Do not render prev/next buttons on mobile device
  return (
    <Box>
      <NavigationBox>
        {isMobileFriendly ? null : (
          <Button className="navigation">
            <span>이전</span>
          </Button>
        )}
        <Pages>
          {pages.map((page, index) => (
            <ButtonBox key={index}>
              <Button className="page">{page}</Button>
            </ButtonBox>
          ))}
        </Pages>
        {isMobileFriendly ? null : (
          <Button className="navigation">
            <span>다음</span>
          </Button>
        )}
      </NavigationBox>
    </Box>
  )
}
