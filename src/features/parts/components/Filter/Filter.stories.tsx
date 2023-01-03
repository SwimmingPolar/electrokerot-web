import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Filter } from 'features'
import { withRouter } from 'lib'

export default {
  title: 'features/Parts/Filter',
  component: Filter,
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
} as ComponentMeta<typeof Filter>

const Template: ComponentStory<typeof Filter> = args => <Filter {...args} />

export const Default = Template.bind({})
