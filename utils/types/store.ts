export interface StoreAction<T> {
  type: string
  payload: {
    value: T
  }
}