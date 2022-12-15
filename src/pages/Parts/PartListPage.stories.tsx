import { ComponentMeta, ComponentStory } from '@storybook/react'
import { PartListPage } from 'pages'

export default {
  title: 'Pages/Parts/PartListPage',
  component: PartListPage
} as ComponentMeta<typeof PartListPage>

const Template: ComponentStory<typeof PartListPage> = args => (
  <PartListPage {...args} />
)

export const Default = Template.bind({})
