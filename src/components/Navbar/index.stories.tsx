import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Navbar, navbarProps } from 'components/Navbar'
import { withRouter } from 'lib'
import styled from 'styled-components'

const Layout = styled.div`
  display: flex;
`
const Content = styled.div`
  height: 3000px;
`

export default {
  title: 'Features/Common/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    withRouter({
      path: '*',
      options: {
        initialEntries: ['/parts'],
        initialIndex: 0
      }
    }),
    Story => (
      <Layout>
        <Story />
        <Content />
      </Layout>
    )
  ],
  args: navbarProps
  // @Issue: can't change the args in the storybook
} as ComponentMeta<typeof Navbar>

const Template: ComponentStory<typeof Navbar> = args => <Navbar {...args} />

export const Fixed = Template.bind({})
Fixed.args = {
  fullWidth: true
}

export const NonFixed = Template.bind({})
NonFixed.args = {
  fixed: false,
  fullWidth: true
}
