import { Story } from '@storybook/react'
import { globalHooks } from 'hooks'

export const useHooks = () => Array.from(globalHooks).forEach(hook => hook())

export const withHooks = (Story: Story) => {
  useHooks()
  return <Story />
}
