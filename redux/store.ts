// Libs
import {
  createStore,
  applyMiddleware, combineReducers, StoreEnhancer, Store
} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { initialState, IState } from './store.type'
import { clock } from './states'

// eslint-disable-next-line consistent-return
const bindMiddleware = (middleware: any): StoreEnhancer | undefined => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
}

const combinedReducers = combineReducers({
  clock
})

export const initStore = (preloadState: IState = initialState): Store =>
// @ts-expect-error
  createStore(combinedReducers, preloadState, bindMiddleware([thunkMiddleware]))
