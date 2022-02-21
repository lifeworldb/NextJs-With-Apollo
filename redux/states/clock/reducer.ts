/* eslint-disable @typescript-eslint/default-param-last */
import { StoreAction } from 'utils/types'
import { clockActionTypes } from './action'

const initialState = {
  lastUpdate: 0,
  light: false,
  count: 0
}

export type InitialStateType = typeof initialState

export default function reducer (
  state = initialState, { type, payload }: StoreAction<typeof initialState>
): typeof initialState {
  switch (type) {
    case clockActionTypes.TICK:
      return {
        ...state,
        lastUpdate: payload.value.lastUpdate,
        light: !!payload.value.light
      }
    case clockActionTypes.INCREMENT:
      return {
        ...state,
        count: state.count + 1
      }
    case clockActionTypes.DECREMENT:
      return {
        ...state,
        count: state.count - 1
      }
    case clockActionTypes.RESET:
      return {
        ...state,
        count: initialState.count
      }
    default:
      return state
  }
}
