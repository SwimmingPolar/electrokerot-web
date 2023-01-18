import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { Part } from 'features'

const partsAdapter = createEntityAdapter<Part>({
  selectId: part => part._id
  // We do not provide a sortComparer.
})

const partSlice = createSlice({
  name: 'part',
  initialState: partsAdapter.getInitialState(),
  reducers: {}
})

// export const {} = partsSlice.actions

// export {}

export const PartReducer = partSlice.reducer
