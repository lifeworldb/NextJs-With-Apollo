export interface IState {
  clock: {
    lastUpdate: number
    light: boolean
    count: number
  }
}

export const initialState: IState = {
  clock: {
    lastUpdate: 0,
    light: false,
    count: 0
  }
}
