import { ComponentMeta, ComponentStory } from '@storybook/react'
import { PopupLayout } from 'components'
import styled from 'styled-components'

const Box = styled.div`
  width: 420px;
  height: 4500px;
`

export default {
  title: 'Features/Common/PopupLayout',
  component: PopupLayout,
  decorators: [
    Story => (
      <Box>
        <Story />
      </Box>
    )
  ]
} as ComponentMeta<typeof PopupLayout>

const Template: ComponentStory<typeof PopupLayout> = args => (
  <PopupLayout {...args}>
    <div style={{ padding: '20px' }}>Some Content</div>
  </PopupLayout>
)
export const Default = Template.bind({})

export const Titled = Template.bind({})
Titled.args = {
  title: 'Some Title'
}

export const Untitled = Template.bind({})
Untitled.args = {
  title: '',
  closeButtonName: '비교하기',
  confirmButtonName: '선택'
}
