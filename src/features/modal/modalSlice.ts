import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'app'
import { ModalRoutesType } from 'constant'

type ModalStates = {
  modalStates: Record<ModalRoutesType, boolean>
  modalKeys: Record<string, boolean>
}

const initialState: ModalStates = {
  modalStates: {
    '/login': false,
    '/signup': false,
    '/findPassword': false
  },
  modalKeys: {}
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload: page }: PayloadAction<ModalRoutesType>) => {
      state.modalStates[page] = true
    },
    closeModal: (state, { payload: page }: PayloadAction<ModalRoutesType>) => {
      state.modalStates[page] = false
    },
    setModalKey: (state, { payload: key }: PayloadAction<string>) => {
      state.modalKeys[key] = true
    },
    clearModalKeys: (
      state,
      { payload: key }: PayloadAction<string | undefined>
    ) => {
      state.modalKeys = key
        ? {
            [key]: true
          }
        : {}
    }
  }
})

export const { openModal, closeModal, setModalKey, clearModalKeys } =
  modalSlice.actions

const selectModalStates = ({ modal: { modalStates } }: RootState) => modalStates
const selectModalKey =
  (key: string) =>
  ({ modal: { modalKeys } }: RootState) =>
    modalKeys[key] ?? false

export { selectModalStates, selectModalKey }

export const ModalReducer = modalSlice.reducer
