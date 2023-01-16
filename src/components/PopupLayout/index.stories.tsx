import { ComponentMeta, ComponentStory } from '@storybook/react'
import { PopupLayout } from 'components'
import styled from 'styled-components'

const Box = styled.div`
  display: flex;
  width: 420px;
`

const Padding = styled.div`
  height: 720px;
  width: 100%;
  background-color: red;
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
    <div style={{ padding: '20px', height: '320px' }}>Some Content</div>
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
