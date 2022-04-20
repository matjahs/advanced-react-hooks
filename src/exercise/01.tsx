// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.tsx

import * as React from "react";

interface State {
  count: number
}

type Action = {
  type: "INCREMENT";
  step: number;
}

function countReducer(state: State, action: Action) {
  if(action.type === "INCREMENT") {
    return {
      ...state,
      count: state.count + action.step
    }
  }

  throw new Error(`ERROR: unknown action type: ${action.type}`);
}

function Counter({ initialCount = 0, step = 1 }) {
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state
  const increment = () => dispatch({type: 'INCREMENT', step})

  return <button onClick={increment}>{count}</button>;
}

function App() {
  return <Counter />;
}

export default App;
