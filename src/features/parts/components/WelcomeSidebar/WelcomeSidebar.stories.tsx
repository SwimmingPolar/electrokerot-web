import { ComponentMeta, ComponentStory } from '@storybook/react'
import { WelcomeSidebar } from './WelcomeSidebar'

export default {
  title: 'Features/Parts/WelcomeSidebar',
  component: WelcomeSidebar,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    title: '손님 맞을래요?',
    comment: '그래서 얼마까지 알아보고 오셨어요'
  },
  argTypes: {
    header: { control: 'text' },
    comment: { control: 'text' }
  }
} as ComponentMeta<typeof WelcomeSidebar>

const Template: ComponentStory<typeof WelcomeSidebar> = args => (
  <WelcomeSidebar {...args} />
)

export const Default = Template.bind({})
