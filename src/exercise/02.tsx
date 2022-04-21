// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.tsx

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

interface State {
  status: 'idle' | 'pending' | 'resolved' | 'rejected'
  data: any
  error: Error | null
}

interface UseAsyncResult extends State {
  run: any;
}

type Action =
  | {type: 'idle'}
  | {type: 'pending'}
  | {type: 'resolved'; data: any}
  | {type: 'rejected'; error: Error}

function asyncReducer(state: State, action: Action): State {
  switch(action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useAsync(
  initialState: Partial<State> = {}
): UseAsyncResult {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const run = React.useCallback((promise: Promise<any>) => {
    if(!promise) {
      return
    }

    dispatch({type: 'pending'})
    promise.then(
      (data: any) => {
        dispatch({type: 'resolved', data})
      },
      (error: any) => {
        dispatch({type: 'rejected', error})
      },
    )
  }, []);

  return {...state, run}
}

function PokemonInfo({pokemonName}: any) {
  const {
    data: pokemon,
    status,
    error,
    run,
  } = useAsync({status: pokemonName ? 'pending' : 'idle'});

  React.useEffect(() => {
    if(!pokemonName) {
      return;
    }

    const pokemonPromise = fetchPokemon(pokemonName);
    run(pokemonPromise);
  }, [pokemonName, run])

  switch(status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName: any) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className='pokemon-info-app'>
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className='pokemon-info'>
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type='checkbox'
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
