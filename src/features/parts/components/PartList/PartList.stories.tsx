import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useDispatch } from 'app'
import { PartList } from 'features'
import { withRouter } from 'lib'
import { parts } from '../../../../../cypress/fixtures'
import { api } from 'features'

export default {
  title: 'features/Parts/PartList',
  component: PartList,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    withRouter({
      path: '/parts/:category',
      options: {
        initialEntries: ['/parts/cpu'],
        initialIndex: 0
      }
    })
  ]
} as ComponentMeta<typeof PartList>

const Template: ComponentStory<typeof PartList> = args => {
  // Reset cached api
  const dispatch = useDispatch()
  dispatch(api.util.resetApiState())
  return <PartList {...args} />
}

export const LiveData = Template.bind({})

export const FakeData = Template.bind({})
FakeData.parameters = {
  mockData: [
    {
      url: 'http://localhost:6006/v1/parts/search',
      method: 'POST',
      status: 200,
      delay: 5000,
      response: parts.map(part => part._id)
    }
  ]
}

export const NoData = Template.bind({})
NoData.parameters = {
  mockData: [
    {
      url: 'http://localhost:6006/v1/parts/search',
      method: 'POST',
      status: 200,
      response: []
    }
  ]
}
