import { ComponentMeta, ComponentStory } from '@storybook/react'
import { withRouter } from 'lib'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { PartsMenu } from 'features'

const Layout = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  position: relative;
`

const RouteIndicator = () => {
  const { category } = useParams()
  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '5px',
          left: '5px',
          display: 'inline-block'
        }}
      >
        <h3 style={{ fontWeight: 'bold' }}>{category}</h3>
      </div>
    </>
  )
}

export default {
  title: 'Features/Parts/PartsMenu',
  component: PartsMenu,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    Story => (
      <Layout>
        <RouteIndicator />
        <Story />
      </Layout>
    ),
    withRouter({
      path: '/parts/:category',
      options: {
        initialEntries: ['/parts/cpu'],
        initialIndex: 0
      }
    })
  ]
} as ComponentMeta<typeof PartsMenu>

const Template: ComponentStory<typeof PartsMenu> = args => (
  <PartsMenu {...args} />
)

export const Default = Template.bind({})
