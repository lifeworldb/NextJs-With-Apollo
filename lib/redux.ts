/* eslint-disable @typescript-eslint/no-explicit-any */
// Libs
import { useMemo } from 'react'
import { AnyAction, Store } from 'redux'
import { initStore } from 'redux/store'
import { initialState, IState } from 'redux/store.type'

let store: Store | undefined

export const initializeStore = (preloadedState: IState = initialState): Store<any, AnyAction> => {
  let iStore = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    iStore = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return iStore
  // Create the store once in the client
  if (!store) store = iStore

  return iStore
}

export const useStore = (initialStateParam: IState): Store<any, AnyAction> => {
  const storeMemo = useMemo(() => initializeStore(initialStateParam), [initialStateParam])
  return storeMemo
}
