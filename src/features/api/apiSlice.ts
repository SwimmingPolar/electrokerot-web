import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { SearchOptionsType } from 'features'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1'
  }),
  endpoints: builder => ({
    getParts: builder.query<string[], SearchOptionsType>({
      query: searchParams => {
        return {
          method: 'post',
          url: 'parts/search',
          body: JSON.stringify(searchParams)
        }
      }
    })
  })
})

export const { reducer: apiReducer, useGetPartsQuery } = api
