import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CategoryAndSearch } from 'features'
import { withRouter } from 'lib'

export default {
  title: 'features/Parts/CategoryAndSearch',
  component: CategoryAndSearch,
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
} as ComponentMeta<typeof CategoryAndSearch>

const Template: ComponentStory<typeof CategoryAndSearch> = args => (
  <CategoryAndSearch {...args} />
)

export const Default = Template.bind({})
