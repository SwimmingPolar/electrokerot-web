import { ComponentMeta, ComponentStory } from '@storybook/react'
import { withHooks, withModalRouter } from 'lib'
import { SignupPage } from 'pages'
import { useNavigate } from 'hooks'
import styled from 'styled-components'

const Layout = styled.div`
  display: flex;
`

const Content = styled.div`
  height: 1500px;
`

const Box = styled.div`
  margin: 30px 0 0 30px;

  button {
    display: inline-block;
    font-family: 'Roboto', sans-serif;
    font-size: 11px;
    padding: 15px 20px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    font-weight: 500;
    color: #000;
    background-color: #fff;
    border: none;
    border-radius: 45px;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease 0s;
    cursor: pointer;
    width: fit-content;
    outline: none;

    :hover {
      background-color: #2ee59d;
      box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
      color: #fff;
      transform: translateY(-7px);
    }
  }
`

export const StoryBookLinkButton = ({
  name,
  to
}: {
  name: string
  to: string
}) => {
  const navigate = useNavigate()
  return (
    <Box>
      <button onClick={() => navigate(to)}>Go to {name}</button>
    </Box>
  )
}

export default {
  title: 'Pages/Auth/SignupPage',
  component: SignupPage,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    withHooks,
    withModalRouter({
      path: '/signup',
      options: {
        initialEntries: ['/', '/signup'],
        initialIndex: 1
      },
      content: <StoryBookLinkButton name="Signup Page" to="/signup" />
    }),
    Story => (
      <Layout>
        <Story />
        <Content />
      </Layout>
    )
  ],
  excludeStories: ['StoryBookLinkButton']
} as ComponentMeta<typeof SignupPage>

const Temp: ComponentStory<typeof SignupPage> = args => <SignupPage {...args} />

export const Default = Temp.bind({})
