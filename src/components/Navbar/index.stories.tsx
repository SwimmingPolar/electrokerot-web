import { SBArrayType } from '@storybook/csf'
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
  args: navbarProps,
  // @Issue: can't change the args in the storybook
  argTypes: {
    fixed: {
      name: 'fixed',
      type: { name: 'boolean', required: false },
      description: 'Fix navbar to the top of the screen',
      control: {
        type: 'boolean'
      }
    },
    fullWidth: {
      name: 'fullWidth',
      type: { name: 'boolean', required: false },
      description: 'Make navbar full width',
      control: {
        type: 'boolean'
      }
    },
    siteName: {
      name: 'site name',
      type: { name: 'string', required: true },
      description: 'name of the site',
      control: {
        type: 'text'
      }
    },
    logoUrl: {
      name: 'logo url',
      type: { name: 'string', required: false },
      description: 'url of the site logo',
      control: {
        type: 'text'
      }
    },
    menuList: {
      name: 'menu list',
      type: { name: 'array', required: true } as SBArrayType,
      description: 'list of menu items',
      control: {
        type: 'array'
      }
    }
  }
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
