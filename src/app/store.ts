import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  api,
  AuthReducer,
  FilterReducer,
  ModalReducer,
  PartReducer
} from 'features'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['filter'],
  // RTK-Query recommendation (probably not needed)
  blacklist: [api.reducerPath]
}

export const store = configureStore({
  reducer: persistReducer(
    persistConfig,
    combineReducers({
      [api.reducerPath]: api.reducer,
      auth: AuthReducer,
      modal: ModalReducer,
      part: PartReducer,
      filter: FilterReducer
    })
  ),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production' ? true : false
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
