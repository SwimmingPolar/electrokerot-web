import { configureStore } from '@reduxjs/toolkit'
import { api, AuthReducer, ModalReducer, PartsReducer } from 'features'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: AuthReducer,
    modal: ModalReducer,
    parts: PartsReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production' ? true : false
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
