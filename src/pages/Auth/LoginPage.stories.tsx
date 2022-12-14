import { ComponentMeta, ComponentStory } from '@storybook/react'
import { withHooks, withModalRouter } from 'lib'
import { LoginPage } from 'pages'
import styled from 'styled-components'
import { StoryBookLinkButton } from './SignupPage.stories'

const Layout = styled.div`
  display: flex;
`

const Content = styled.div`
  height: 1500px;
`

export default {
  title: 'Pages/Auth/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    withHooks,
    withModalRouter({
      path: '/login',
      options: {
        initialEntries: ['/', '/login'],
        initialIndex: 1
      },
      content: <StoryBookLinkButton name="Login Page" to="/login" />
    }),
    Story => (
      <Layout>
        <Story />
        <Content />
      </Layout>
    )
  ]
} as ComponentMeta<typeof LoginPage>

const Temp: ComponentStory<typeof LoginPage> = args => <LoginPage {...args} />

export const Default = Temp.bind({})
