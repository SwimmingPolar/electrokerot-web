import { useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import {
  selectFilters,
  selectPartsToCompare,
  useLoadFilterJson
} from 'features'
import React, { FC, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ElementDepth } from 'styles'
import { parts } from '../../../../../cypress/fixtures'
import { ContentLayout as Content } from '../ContentLayout/ContentLayout'
import {
  MemoizedTableRow as TableRow,
  TableFooter,
  TableHeader
} from './components'

const Box = styled(Content)`
  z-index: ${ElementDepth.parts.category};
`

const Table = styled.div`
  overflow: hidden;
`

const TableContent = styled.div``

const TableSection = styled.section`
  padding: 0 20px;
`

export const PartList: FC = () => {
  const { category } = useParams() as { category: PartsCategoriesType }

  const filtersData = useSelector(
    state => selectFilters(state)[category]?.filterData || []
  )

  // Get the first 5 filter names
  const headerNames = useMemo(() => {
    let headerNames = filtersData
      .slice(0, 4)
      .map(filter => filter.category || filter.subCategory) as string[]
    // Put the name of the part as the first header
    headerNames = ['부품명', ...headerNames, '가격']
    return headerNames
  }, [filtersData])

  // Get selected parts to compare
  const partsToCompare = useSelector(state => selectPartsToCompare(state))

  // Load the filters data in case it is not loaded yet
  useLoadFilterJson({ category })

  return (
    <Box>
      <Table>
        <TableSection>
          {/* Header */}
          <TableHeader headerNames={headerNames} />
          {/* Content */}
          <TableContent>
            {parts.map((part, index) => {
              const totalPartsToCompare = partsToCompare.length
              const isChecked = partsToCompare.includes(part._id)
              const isDisabled = totalPartsToCompare >= 3 && !isChecked
              return (
                <TableRow
                  key={index}
                  headerNames={headerNames}
                  part={part}
                  isChecked={isChecked}
                  isDisabled={isDisabled}
                />
              )
            })}
          </TableContent>
        </TableSection>
        {/* Footer */}
        <TableFooter />
      </Table>
    </Box>
  )
}

export const MemoizedPartList = React.memo(PartList)
