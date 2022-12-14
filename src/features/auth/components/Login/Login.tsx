import { Input, ModalNavLink, Submit } from 'components'
import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { media } from 'styles'

const SidebarBox = styled.div`
  width: 95px;

  img {
    height: 100%;
  }

  ${media.device('mobile', 'foldable')`
    display: none;
  `}
`

const Img = styled.div`
  background: url('/assets/images/login_form_image.png') no-repeat -5px;
  width: 100%;
  height: 100%;
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  width: 280px;
  margin: 85px auto;
  align-items: center;
  gap: 16px;

  ${media.foldable`
    margin: 15px auto;
  `}
  ${media.mobile`
    margin: 35px auto;
  `}
`

const TitleBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 58px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};

  h1 {
    font-size: 32px;
    font-weight: 700;
    font-family: ${({ theme }) => theme.fonts.primary};
  }
`

const FormBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  input[type='submit'] {
    color: ${({ theme }) => theme.colors.black};
    border: 2px solid ${({ theme }) => theme.colors.primary400};
    background-color: ${({ theme }) => theme.colors.white};

    :hover,
    :focus-visible {
      transition: 0.5s;
      border: 2px solid transparent;
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.black};
    }
  }
`

const LinkBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  a {
    outline: none !important;
    font-size: 13px;
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 4px;
    color: ${({ theme }) => theme.colors.gray400};
    padding: 0 10px;
    transition: 0.4s;
  }

  a:hover {
    color: ${({ theme }) => theme.colors.black};
  }

  a:focus-visible {
    color: ${({ theme }) => theme.colors.black};
  }
`

const SocialLoginBox = styled.div`
  width: 100%;
`

const Separator = styled.div`
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;

  h3 {
    font-size: 12px;
    font-family: ${({ theme }) => theme.fonts.primary};
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.white};
    padding: 0 15px;
    z-index: 1;
  }

  ::after {
    content: '';
    width: 100%;
    height: 1px;
    margin: -5px;
    background-color: ${({ theme }) => theme.colors.black};
    z-index: 0;
  }
`

// @Issue: social login letter not centering properly
const SocialLoginSelectionBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  button:focus-visible {
    outline: none !important;
  }
`

const StyledSocialLoginButton = styled.button`
  display: flex;
  box-sizing: content-box;
  justify-content: space-around;
  align-items: center;
  padding: 7px;
  font-size: 45px;
  font-weight: 700;
  width: 52px;
  height: 52px;
  line-height: 65px;
  border: 1px solid ${({ theme }) => theme.colors.black};
  border-radius: 50%;
  cursor: pointer;

  :hover,
  :focus-visible {
    border-width: 3px;
    border-color: ${({ theme }) => theme.colors.primary400};
    background-color: ${({ theme }) => theme.colors.primary100};
  }
`
const SocialLoginButton = (props: ComponentPropsWithoutRef<'button'>) => (
  <StyledSocialLoginButton tabIndex={0} {...props} />
)

type LoginProps = {
  handleExitMotion: (pathname: string) => void
}

export const Login = ({ handleExitMotion }: LoginProps) => {
  return (
    <>
      <SidebarBox>
        <Img />
      </SidebarBox>
      <Main>
        <TitleBox>
          <h1>로그인</h1>
        </TitleBox>
        <FormBox>
          <form>
            <Input type="text" placeholder="이메일" />
            <Input type="password" placeholder="비밀번호" />
            <LinkBox>
              <ModalNavLink
                to="/findPassword"
                handleExitMotion={handleExitMotion}
              >
                비밀번호 찾기
              </ModalNavLink>
              <ModalNavLink to="/signup" handleExitMotion={handleExitMotion}>
                회원가입
              </ModalNavLink>
            </LinkBox>
            <Submit value="로그인" />
          </form>
        </FormBox>
        <SocialLoginBox>
          <Separator>
            <h3>소셜 로그인</h3>
          </Separator>
          <SocialLoginSelectionBox>
            <SocialLoginButton>G</SocialLoginButton>
            <SocialLoginButton>N</SocialLoginButton>
            <SocialLoginButton>K</SocialLoginButton>
          </SocialLoginSelectionBox>
        </SocialLoginBox>
      </Main>
    </>
  )
}
