// Libs
import { FC, ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import { initializeStore } from '@libs'
import useInterval from '@hooks/useInterval'
import Clock from '@components/clock'
import Counter from '@components/counter'
import { tick } from '@state/states/clock/action'
import { GetStaticProps } from 'next'

const Redux: FC = (): ReactElement => {
  // Tick the time every second
  const dispatch = useDispatch()

  useInterval(() => {
    dispatch(tick({
      lastUpdate: Date.now(),
      light: true,
      count: 0
    }))
  }, 1000)

  return (
    <div>
      <Clock />
      <Counter />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const store = initializeStore()
  const { dispatch } = store

  dispatch(tick({
    lastUpdate: Date.now(),
    light: true,
    count: 0
  }))

  return {
    props: {
      initialReduxState: store.getState()
    },
    revalidate: 1
  }
}

export default Redux
