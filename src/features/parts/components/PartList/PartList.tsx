import { useGetPartsQuery, useSearchOptions } from 'features'
import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { ElementDepth } from 'styles'
import { ContentLayout as Content } from '../ContentLayout/ContentLayout'

const Box = styled(Content)`
  z-index: ${ElementDepth.parts.category};
  height: 1500px;
`

export const PartList: FC = () => {
  // Get search options
  const searchOptions = useSearchOptions()
  // Fetch parts
  const { isLoading, isError, isSuccess, data } =
    useGetPartsQuery(searchOptions)

  useEffect(() => {
    console.log(data)
  }, [data, isSuccess])

  return (
    <Box>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {isSuccess &&
        data &&
        data.map((partId, index) => <span key={index}>{partId}</span>)}
    </Box>
  )
}

export const MemoizedPartList = React.memo(PartList)
