import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.primary200};
  border-radius: 7px;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
  padding-left: 25px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.primary400};
  }
  :focus-visible::placeholder {
    color: ${({ theme }) => theme.colors.primary};
  }
  :focus-visible {
    border: 2px solid ${({ theme }) => theme.colors.primary300};
    background-color: ${({ theme }) => theme.colors.primary100};
  }
  :not(:focus-visible):hover {
    border: 2px solid ${({ theme }) => theme.colors.primary400};
  }
`
export const Input = (props: ComponentPropsWithoutRef<'input'>) => (
  <StyledInput tabIndex={0} {...props} />
)

const StyledSubmit = styled.input`
  height: 48px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.black};
  border-radius: 7px;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: 700;
  font-size: 20px;
  text-align: center;
  box-shadow: 0px 0px 6px 4px rgba(63, 75, 90, 0.11),
    0px 0px 6px 3px rgba(63, 75, 90, 0.12),
    0px 0px 7px 2px rgba(63, 75, 90, 0.12);
  cursor: pointer;
  transition: 0.3s;

  :hover {
    box-shadow: 0px 0px 10px 7px rgba(63, 75, 90, 0.11),
      0px 0px 10px 6px rgba(63, 75, 90, 0.12),
      0px 0px 9px 5px rgba(63, 75, 90, 0.12);
  }

  :focus-visible {
    transition: 0.5s;
    border: 2px solid transparent;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.black};
  }
`
export const Submit = (props: ComponentPropsWithoutRef<'input'>) => (
  <StyledSubmit tabIndex={0} type="submit" value="Submit" {...props} />
)
