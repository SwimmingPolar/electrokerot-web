import { Navbar, NavbarProps, navbarProps } from 'components'
import React from 'react'
import styled from 'styled-components'

const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`

const Section = styled.section`
  display: flex;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  height: 100%;
`

type PageLayoutProps = {
  children?: React.ReactNode
} & Partial<NavbarProps>

export const PageLayout = ({ children, ...rest }: PageLayoutProps) => {
  const MergedNavbarProps = Object.assign({}, navbarProps, rest)
  return (
    <Main className="scrollbar-padding">
      <Navbar {...MergedNavbarProps} />
      <Section>{children}</Section>
    </Main>
  )
}
