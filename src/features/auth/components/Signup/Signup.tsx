import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { Input, ModalNavLink, Submit } from 'components'
import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { media } from 'styles'

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  margin: 35px auto;
  align-items: center;
  gap: 15px;

  .backward {
    display: flex;
    align-items: center;
    gap: 5px;

    position: absolute;
    top: 22px;
    left: 20px;

    ${media.device('mobile', 'foldable')`
      display: none;
    `}

    span {
      font-size: 15px;
      font-family: ${({ theme }) => theme.fonts.primary};
      font-weight: bold;
      line-height: 1.5;
    }

    :focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.black};
      outline-offset: 3px;
    }
  }
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
  display: flex;
  flex-direction: column;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  input[type='submit'] {
    margin-top: 5px;
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

const SocialSignupBox = styled.div`
  width: 100%;
`

const Separator = styled.div`
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  h3 {
    font-size: 12px;
    font-family: ${({ theme }) => theme.fonts.primary};
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.white};
    padding: 0 12px;
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
const SocialSignupButtonGroup = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;

  margin-top: 15px;
`

const StyledSocialSignupButton = styled.button`
  cursor: pointer;
  height: 32px;
  border: 1.5px solid ${({ theme }) => theme.colors.black};
  border-radius: 6px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 12px;
  font-weight: 700;

  :hover,
  :focus-visible {
    border-width: 2px;
    background-color: ${({ theme }) => theme.colors.primary100};
  }
`
const SocialSignupButton = (props: ComponentPropsWithoutRef<'button'>) => (
  <StyledSocialSignupButton tabIndex={0} {...props} />
)

type SignupProps = {
  handleExitMotion: (pathname: string) => void
}

export const Signup = ({ handleExitMotion }: SignupProps) => {
  return (
    <Box>
      <TitleBox>
        <h1>회원가입</h1>
      </TitleBox>
      <FormBox>
        <form>
          <Input type="text" placeholder="이메일" />
          <Input type="password" placeholder="비밀번호" />
          <Input type="password" placeholder="비밀번호 확인" />
          <Input type="text" placeholder="닉네임" />
          <Submit type="submit" value="회원가입" />
        </form>
      </FormBox>
      <SocialSignupBox>
        <Separator>
          <h3>OR</h3>
        </Separator>
        <SocialSignupButtonGroup>
          <SocialSignupButton>Google 회원가입</SocialSignupButton>
          <SocialSignupButton>Naver 회원가입</SocialSignupButton>
          <SocialSignupButton>Kakao 회원가입</SocialSignupButton>
        </SocialSignupButtonGroup>
      </SocialSignupBox>
      <ModalNavLink
        to="/login"
        className="backward"
        handleExitMotion={handleExitMotion}
      >
        <KeyboardBackspaceIcon />
        <span>뒤로 가기</span>
      </ModalNavLink>
    </Box>
  )
}
