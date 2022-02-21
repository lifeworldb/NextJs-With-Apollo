/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { decrement, increment, reset } from '@state/states/clock/action'

const useCounter = (): any => {
  const count = useSelector(state => state.clock.count)
  const dispatch = useDispatch()

  const onIncrement = (): void => {
    dispatch(increment())
  }

  const onDecrement = (): void => {
    dispatch(decrement())
  }

  const onReset = (): void => {
    dispatch(reset())
  }

  return { count, onIncrement, onDecrement, onReset }
}

const Counter: FC = (): ReactElement => {
  const { count, onIncrement, onDecrement, onReset } = useCounter()

  return (
    <div>
      <h1>
        Count: <span>{count}</span>
      </h1>
      <button onClick={onIncrement} type="button">+1</button>
      <button onClick={onDecrement} type="button">-1</button>
      <button onClick={onReset} type="button">Reset</button>
    </div>
  )
}

export default Counter
