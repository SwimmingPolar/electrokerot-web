import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChangeFiltersPopup } from 'features'
import { withRouter } from 'lib'
import styled from 'styled-components'
import { useLoadFilterJson } from '../Filter/hooks/useLoadFilterJson'

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #666;
  height: 100%;
`

export default {
  title: 'features/Parts/ChangeFiltersPopup',
  component: ChangeFiltersPopup,
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    toggleChangeFiltersPopup: {
      action: 'toggleChangeFiltersPopup'
    }
  },
  decorators: [
    withRouter({
      path: '/parts/:category',
      options: {
        initialEntries: ['/parts/cpu'],
        initialIndex: 0
      }
    }),
    Story => (
      <Box>
        <Story />
      </Box>
    )
  ]
} as ComponentMeta<typeof ChangeFiltersPopup>

const Template: ComponentStory<typeof ChangeFiltersPopup> = args => {
  // Load filter json file
  useLoadFilterJson()
  return <ChangeFiltersPopup {...args} />
}

export const Default = Template.bind({})
