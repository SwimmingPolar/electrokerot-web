import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { CategoryNavigationSidebar } from 'features'

export const PartListPage: FC = () => {
  const { category } = useParams()

  return <CategoryNavigationSidebar />
}
