import { configureStore } from '@reduxjs/toolkit'
import reduxLoggerMW from 'store/middlewares/reduxLogger'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

// REDUCERS

const middlewares: Array<any> = process.env.NODE_ENV === 'production' ? [] : [reduxLoggerMW]

// const middlewares: any[] = []

const store = configureStore({
  reducer: {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(middlewares),
  devTools: process.env.NODE_ENV === 'development'
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunkDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
