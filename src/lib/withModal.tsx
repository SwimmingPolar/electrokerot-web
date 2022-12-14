import { Story } from '@storybook/react'
import { StorybookModalBackdrop, StorybookModalLayout } from 'components'

export const withModal = (Story: Story) => {
  return (
    <StorybookModalBackdrop>
      <StorybookModalLayout>
        <Story />
      </StorybookModalLayout>
    </StorybookModalBackdrop>
  )
}
