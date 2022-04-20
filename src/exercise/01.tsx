// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.tsx

import * as React from "react";

function countReducer(prevCount: number, changeCount: number) {
  return prevCount + changeCount;
}

function Counter({ initialCount = 0, step = 1 }) {
  const [count, changeCount] = React.useReducer(countReducer, initialCount)

  const increment = () => changeCount(step)
  return <button onClick={increment}>{count}</button>;
}

function App() {
  return <Counter />;
}

export default App;
