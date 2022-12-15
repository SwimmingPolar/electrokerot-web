import { ComponentMeta, ComponentStory } from '@storybook/react'
import { NavigationSidebar } from 'features'

export default {
  title: 'Features/Parts/NavigationSidebar',
  component: NavigationSidebar
} as ComponentMeta<typeof NavigationSidebar>

const Template: ComponentStory<typeof NavigationSidebar> = args => (
  <NavigationSidebar {...args} />
)

export const Default = Template.bind({})
