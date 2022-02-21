
import { StoreAction } from 'utils/types'
import type { InitialStateType } from './reducer'

export const clockActionTypes = {
  TICK: 'TICK',
  INCREMENT: 'ADINCREMENTD',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET'
}

export const tick = (data: InitialStateType): StoreAction<InitialStateType> => ({
  type: clockActionTypes.TICK,
  payload: {
    value: data
  }
})

export const increment = (): StoreAction<null> => ({
  type: clockActionTypes.INCREMENT,
  payload: { value: null }
})

export const decrement = (): StoreAction<null> => ({
  type: clockActionTypes.DECREMENT,
  payload: { value: null }
})

export const reset = (): StoreAction<null> => ({
  type: clockActionTypes.RESET,
  payload: { value: null }
})
