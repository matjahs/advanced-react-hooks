// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.tsx

import * as React from "react";

function countReducer(prevCount: number, newCount: number) {
  return newCount;
}

function Counter({ initialCount = 0, step = 1 }) {
  const [count, setCount] = React.useReducer(countReducer, initialCount);

  const increment = () => setCount(count + step);
  return <button onClick={increment}>{count}</button>;
}

function App() {
  return <Counter />;
}

export default App;
