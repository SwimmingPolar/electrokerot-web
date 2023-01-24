import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { Part } from 'features'

const partsAdapter = createEntityAdapter<Part>({
  selectId: part => part._id
  // We do not provide a sortComparer.
})

const initialState = partsAdapter.getInitialState({
  selectedParts: [] as string[]
})

type PartState = typeof initialState

const partSlice = createSlice({
  name: 'part',
  initialState,
  reducers: {
    addPartToCompare: (state, action) => {
      state.selectedParts.push(action.payload)
    },
    removePartToCompare: (state, action) => {
      state.selectedParts = state.selectedParts.filter(
        partId => partId !== action.payload
      )
    }
  }
})

const selectPartsToCompare = ({ part }: { part: PartState }) =>
  part.selectedParts

export { selectPartsToCompare }

export const { addPartToCompare, removePartToCompare } = partSlice.actions

export const PartReducer = partSlice.reducer
