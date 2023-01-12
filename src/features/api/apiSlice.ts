import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1'
  }),
  endpoints: builder => ({
    getParts: builder.query({
      query: searchParams => {
        return {
          method: 'post',
          url: 'parts/search',
          body: searchParams
        }
      }
    })
  })
})

export const { reducer: apiReducer, useGetPartsQuery } = api
