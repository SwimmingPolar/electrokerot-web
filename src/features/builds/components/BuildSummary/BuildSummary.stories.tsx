import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BuildSummary } from 'features'

export default {
  title: 'Features/Parts/BuildSummary',
  component: BuildSummary
} as ComponentMeta<typeof BuildSummary>

const Template: ComponentStory<typeof BuildSummary> = args => (
  <BuildSummary {...args} />
)

export const Default = Template.bind({})
