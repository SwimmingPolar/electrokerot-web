import { ComponentMeta, ComponentStory } from '@storybook/react'
import { withRouter } from 'lib'
import { PartListPage } from 'pages'

export default {
  title: 'Pages/Parts/PartListPage',
  component: PartListPage,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    withRouter({
      path: '*',
      options: {
        initialEntries: ['/parts/cpu'],
        initialIndex: 0
      }
    })
  ]
} as ComponentMeta<typeof PartListPage>

const Template: ComponentStory<typeof PartListPage> = args => (
  <PartListPage {...args} />
)

export const Default = Template.bind({})
