import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const partSlice = createSlice({
  name: 'part',
  initialState,
  reducers: {}
})

// export const {} = partsSlice.actions

// export {}

export const PartReducer = partSlice.reducer
