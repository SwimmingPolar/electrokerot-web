import { ComponentMeta, ComponentStory } from '@storybook/react'
import { StorybookModalBackdrop, StorybookModalLayout } from 'components'
import { Login } from 'features'
import { withRouter } from 'lib'

export default {
  title: 'Features/Auth/Login',
  component: Login,
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
} as ComponentMeta<typeof Login>

const Template: ComponentStory<typeof Login> = args => <Login {...args} />

export const Default = Template.bind({})
