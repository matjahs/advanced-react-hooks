// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.tsx

import * as React from "react";

interface State {
  count: number
}

type UpdateFn = (arg: State) => State;

function countReducer(prevState: State, state: State | UpdateFn) {
  return typeof state === "function" ? state(prevState) : state;
}

function Counter({ initialCount = 0, step = 1 }) {
  const [state, setState] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state
  const increment = () =>
    setState(currentState => ({count: currentState.count + step}))

  return <button onClick={increment}>{count}</button>;
}

function App() {
  return <Counter />;
}

export default App;
