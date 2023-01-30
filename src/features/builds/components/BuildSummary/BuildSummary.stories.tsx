import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BuildSummary } from 'features'
import { withRouter } from 'lib'

export default {
  title: 'Features/Builds/BuildSummary',
  component: BuildSummary,
  decorators: [
    withRouter({
      path: '/parts/:category',
      options: {
        initialEntries: ['/parts/cpu'],
        initialIndex: 0
      }
    })
  ]
} as ComponentMeta<typeof BuildSummary>

const Template: ComponentStory<typeof BuildSummary> = args => (
  <BuildSummary {...args} />
)

export const Default = Template.bind({})
