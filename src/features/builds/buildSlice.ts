import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app'
import { Build } from 'features'

const buildsAdapter = createEntityAdapter<Build>({
  selectId: build => build._id
})

const initialState = buildsAdapter.getInitialState()

const buildSlice = createSlice({
  name: 'build',
  initialState,
  reducers: {
    addBuild: buildsAdapter.addOne,
    updateBuild: buildsAdapter.updateOne,
    removeBuild: buildsAdapter.removeOne,
    setBuilds: buildsAdapter.setAll
  }
})

export const { addBuild, updateBuild, removeBuild, setBuilds } =
  buildSlice.actions

export const {
  selectAll: selectAllBuilds,
  selectById: selectBuildById,
  selectTotal: selectTotalBuilds
} = buildsAdapter.getSelectors<RootState>(state => state.build)

export const BuildReducer = buildSlice.reducer
