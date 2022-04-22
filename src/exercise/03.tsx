// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.tsx

import * as React from "react";

type SetCount = (arg: any) => void;

const CountContext = React.createContext<[count: number, setCount: any] | undefined>(undefined);

function CountProvider(props: any) {
  const [count, setCount] = React.useState(0);
  const value = [count, setCount];

  return <CountContext.Provider value={value} {...props} />;
}

function useCount(): [count: number, setCount: SetCount] {
  const context = React.useContext(CountContext);

  if (!context) {
    throw new Error("useCount must be used within the CountProvider");
  }

  return context;
}

function CountDisplay() {
  const [count] = useCount();

  return <div>{`The current count is ${count}`}</div>;
}

function Counter() {
  const [, setCount] = useCount();

  const increment = setCount ? () => setCount((c: any) => c + 1) : () => {};
  return <button onClick={increment}>Increment count</button>;
}

function App() {
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  );
}

export default App;
