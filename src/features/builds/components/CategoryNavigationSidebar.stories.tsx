import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CategoryNavigationSidebar } from 'features'
import { withRouter } from 'lib'
import styled from 'styled-components'

const Box = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;

  > * {
    order: 2;
  }
`

const Content = styled.div`
  flex: 1;
  padding: 50px;
`

export default {
  title: 'features/Builds/CategoryNavigationSidebar',
  component: CategoryNavigationSidebar,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    withRouter({
      path: '*',
      options: {
        initialEntries: ['/parts/cpu'],
        initialIndex: 0
      }
    }),
    Story => (
      <Box>
        <Content>
          <h1>Content Area</h1>
        </Content>
        <Story className="story" />
      </Box>
    )
  ]
} as ComponentMeta<typeof CategoryNavigationSidebar>

const Template: ComponentStory<typeof CategoryNavigationSidebar> = args => (
  <CategoryNavigationSidebar {...args} />
)

export const Default = Template.bind({})
