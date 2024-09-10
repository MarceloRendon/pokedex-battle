import React, { useEffect, useState } from "react";

interface Pokemon {
  name: string;
  url: string;
  sprite?: string;
}

function PokeList() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Estado para el término de búsqueda
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]); // Estado para el Pokémon filtrado
  const [error, setError] = useState<string | null>(null); // Estado para el manejo de errores

  useEffect(() => {
    // Llamada a la API de Pokémon para obtener los 5 primeros Pokémon
    fetch("https://pokeapi.co/api/v2/pokemon?limit=5")
      .then((response) => response.json())
      .then((data) => {
        const fetches = data.results.map((pokemon: Pokemon) =>
          fetch(pokemon.url)
            .then((res) => res.json())
            .then((pokemonData) => ({
              name: pokemon.name,
              url: pokemon.url,
              sprite: pokemonData.sprites.front_default, // Guardar el sprite del Pokémon
            }))
        );

        // Esperamos todas las promesas
        Promise.all(fetches).then((pokemons) => {
          setPokemonList(pokemons);
          setFilteredPokemon(pokemons); // Inicialmente mostramos todos los Pokémon
        });
      })
      .catch((error) => console.error("Error al obtener los Pokémon:", error));
  }, []);

  // Función que se ejecuta cuando se hace submit para buscar un Pokémon específico
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchTerm.trim() !== "") {
      // Llamada a la API para buscar el Pokémon por nombre
      fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Pokémon no encontrado");
          }
          return response.json();
        })
        .then((data) => {
          const searchedPokemon: Pokemon = {
            name: data.name,
            url: `https://pokeapi.co/api/v2/pokemon/${data.id}`,
            sprite: data.sprites.front_default,
          };
          setFilteredPokemon([searchedPokemon]); // Mostrar solo el Pokémon encontrado
          setError(null); // Limpiar errores
        })
        .catch((err) => {
          setError(err.message);
          setFilteredPokemon([]); // Limpiar la lista si no se encuentra el Pokémon
        });
    } else {
      // Si el campo de búsqueda está vacío, mostrar los primeros 5 Pokémon
      setFilteredPokemon(pokemonList);
      setError(null);
    }
  };

  // Función que se ejecuta cada vez que el usuario escribe en el input de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    // Si el término de búsqueda está vacío, volver a mostrar los 5 primeros Pokémon
    if (event.target.value === "") {
      setFilteredPokemon(pokemonList);
      setError(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className="mb-3">
        <input
          type="text"
          placeholder="Buscar Pokémon"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control"
        />
        <button type="submit" className="btn btn-primary mt-2">
          Buscar
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group">
        {filteredPokemon.map((pokemon, index) => (
          <li key={index} className="list-group-item d-flex align-items-center">
            <img src={pokemon.sprite} alt={pokemon.name} className="me-3" />
            {pokemon.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PokeList;
