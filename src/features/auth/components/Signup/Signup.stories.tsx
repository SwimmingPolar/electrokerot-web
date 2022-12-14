import { ComponentMeta, ComponentStory } from '@storybook/react'
import { StorybookModalBackdrop, StorybookModalLayout } from 'components'
import { withRouter } from 'lib'
import { Signup } from './Signup'

export default {
  title: 'Features/Auth/Signup',
  component: Signup,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    withRouter({
      path: '*'
    }),
    Story => (
      <StorybookModalBackdrop>
        <StorybookModalLayout>
          <Story />
        </StorybookModalLayout>
      </StorybookModalBackdrop>
    )
  ]
} as ComponentMeta<typeof Signup>

const Temp: ComponentStory<typeof Signup> = args => <Signup {...args} />

export const Default = Temp.bind({})
