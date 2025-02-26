// useContext: Caching response data in context
// 💯 caching in a context provider (exercise)
// http://localhost:3000/isolated/exercise/03.extra-2.js

import * as React from "react";
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from "../pokemon";
import {useAsync} from "../utils";

type Action = {type: "ADD_POKEMON"; pokemonName: string; pokemonData: any;};
type Cache = Record<string, any>;

const PokemonCacheContext = React.createContext<[cache: any, dispatch: React.Dispatch<Action>] | undefined>(undefined);

function PokemonCacheProvider(props: any) {
  const [cache, dispatch] = React.useReducer(pokemonCacheReducer, {});

  return <PokemonCacheContext.Provider value={[cache, dispatch]} {...props} />;
}

function pokemonCacheReducer(state: Cache, action: Action): Cache {
  switch(action.type) {
    case "ADD_POKEMON": {
      return {...state, [action.pokemonName]: action.pokemonData};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function usePokemonCache(): [cache: Cache, dispatch: React.Dispatch<Action>] {
  const context = React.useContext(PokemonCacheContext);

  if (!context) {
    throw new Error("usePokemonContext must be used withing the PokemonCacheProvider")
  }

  return context;
}

function PokemonInfo({pokemonName}: any): any {
  const [cache, dispatch] = usePokemonCache();

  const {data: pokemon, status, error, run, setData} = useAsync();

  React.useEffect(() => {
    if(!pokemonName) {
      return;
    } else if(cache[pokemonName]) {
      setData(cache[pokemonName]);
    } else {
      run(
        fetchPokemon(pokemonName).then(pokemonData => {
          dispatch({type: "ADD_POKEMON", pokemonName, pokemonData});
          return pokemonData;
        }),
      );
    }
  }, [dispatch, cache, pokemonName, run, setData]);

  if(status === "idle") {
    return "Submit a pokemon";
  } else if(status === "pending") {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if(status === "rejected") {
    throw error;
  } else if(status === "resolved") {
    return <PokemonDataView pokemon={pokemon} />;
  }
}

function PreviousPokemon({onSelect}: any) {
  const [cache] = usePokemonCache()
  return (
    <div>
      Previous Pokemon
      <ul style={{listStyle: "none", paddingLeft: 0}}>
        {Object.keys(cache).map(pokemonName => (
          <li key={pokemonName} style={{margin: "4px auto"}}>
            <button
              style={{width: "100%"}}
              onClick={() => onSelect(pokemonName)}
            >
              {pokemonName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PokemonSection({onSelect, pokemonName}: any) {
  return (
    <PokemonCacheProvider>
      <div style={{display: "flex"}}>
        <PreviousPokemon onSelect={onSelect} />
        <div className="pokemon-info" style={{marginLeft: 10}}>
          <PokemonErrorBoundary
            onReset={() => onSelect("")}
            resetKeys={[pokemonName]}
          >
            <PokemonInfo pokemonName={pokemonName} />
          </PokemonErrorBoundary>
        </div>
      </div>
    </PokemonCacheProvider>
  );
}

function App() {
  const [pokemonName, setPokemonName] = React.useState(null);

  function handleSubmit(newPokemonName: any) {
    setPokemonName(newPokemonName);
  }

  function handleSelect(newPokemonName: any) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <PokemonSection onSelect={handleSelect} pokemonName={pokemonName} />
    </div>
  );
}

export default App;
