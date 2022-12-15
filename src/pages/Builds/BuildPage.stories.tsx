import { ComponentMeta, ComponentStory } from '@storybook/react'
import { withRouter } from 'lib'
import { BuildPage } from 'pages'

export default {
  title: 'Pages/Builds/BuildPage',
  component: BuildPage,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    withRouter({
      path: '/builds',
      options: {
        initialEntries: ['/builds'],
        initialIndex: 0
      }
    })
  ]
} as ComponentMeta<typeof BuildPage>

const Template: ComponentStory<typeof BuildPage> = args => (
  <BuildPage {...args} />
)

export const Default = Template.bind({})
