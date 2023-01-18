import { ComponentMeta, ComponentStory } from '@storybook/react'
import { persistor, useDispatch } from 'app'
import { PartsCategoriesType } from 'constant'
import { Filter, setFilterOptions } from 'features'
import { withProvider, withRouter } from 'lib'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const Button = styled.button`
  display: inline-block;
  font-family: 'Roboto', sans-serif;
  font-size: 11px;
  padding: 15px 20px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  width: fit-content;
  outline: none;
  margin: 15px 0 0 15px;

  &:hover {
    background-color: #2ee59d;
    box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
    color: #fff;
    transform: translateY(-5px);
  }
`

const PurgeButton = () => {
  const dispatch = useDispatch()
  const { category } = useParams() as { category: PartsCategoriesType }

  const handleClick = () => {
    persistor.purge()
    dispatch(
      setFilterOptions({
        category,
        filterOptions: []
      })
    )
  }

  return <Button onClick={handleClick}>Purge Store</Button>
}

export default {
  title: 'features/Parts/Filter',
  component: Filter,
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
} as ComponentMeta<typeof Filter>

const Template: ComponentStory<typeof Filter> = args => {
  return (
    <>
      <Filter {...args} />
      <PurgeButton />
    </>
  )
}

export const Default = Template.bind({})
