import { ComponentMeta, ComponentStory } from '@storybook/react'
import { withRouter } from 'lib'
import { PartsMenuPage } from 'pages'

export default {
  title: 'Pages/Parts/PartsMenuPage',
  component: PartsMenuPage,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    withRouter({
      path: '/parts/:category',
      options: {
        initialEntries: ['/parts/cpu'],
        initialIndex: 0
      }
    })
  ]
} as ComponentMeta<typeof PartsMenuPage>

const Template: ComponentStory<typeof PartsMenuPage> = args => (
  <PartsMenuPage {...args} />
)

export const Default = Template.bind({})
