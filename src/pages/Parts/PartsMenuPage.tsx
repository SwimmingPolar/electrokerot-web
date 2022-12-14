import { PageLayout } from 'components'
import { PartsMenu, WelcomeSidebar } from 'features'
import { FC } from 'react'
import styled from 'styled-components'

const Root = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`

export const PartsMenuPage: FC = () => {
  return (
    <Root>
      <WelcomeSidebar
        title="손님 맞을래요?"
        comment="그래서 얼마까지 알아보고 오셨어요"
      />
      <PageLayout>
        <PartsMenu />
      </PageLayout>
    </Root>
  )
}
