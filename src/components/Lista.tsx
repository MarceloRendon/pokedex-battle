import React, { useEffect, useState } from "react";
import axios from "axios";

interface Pokemon {
  name: string;
  url: string;
}

interface ListaProps {
  onItemSelect: (pokemon: Pokemon) => void;
}

const Lista: React.FC<ListaProps> = ({ onItemSelect }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Llamada a la API de Pokémon para obtener los primeros 10 Pokémon
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=110")
      .then((response) => {
        setPokemons(response.data.results);
      })
      .catch((error) => console.error(error));
  }, []);

  // Función para manejar la búsqueda de un Pokémon específico desde la API
  const handleSearch = () => {
    if (searchTerm.trim() === "") return;

    setLoading(true);
    setError(null);
    setSearchResult(null);

    // Intentamos obtener el Pokémon por nombre o por ID
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`)
      .then((response) => {
        const foundPokemon = {
          name: response.data.name,
          url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}/`,
        };
        setSearchResult(foundPokemon);
        setLoading(false);
      })
      .catch(() => {
        setError("Pokémon no encontrado.");
        setLoading(false);
      });
  };

  const listaEstilo: React.CSSProperties = {
    flex: 1,
    padding: "10px",
    borderRight: "1px solid #ccc",
    overflowY: "auto",
  };

  const listaItemEstilo: React.CSSProperties = {
    cursor: "pointer",
    padding: "8px",
    borderBottom: "1px solid #ccc",
  };

  return (
    <div style={listaEstilo}>
      <h3>Busca un Pokémon</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Ingresa nombre o ID del Pokémon"
      />
      <button onClick={handleSearch}>Buscar</button>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      {/* Mostrar resultado de búsqueda si se encuentra */}
      {searchResult && (
        <div style={listaItemEstilo} onClick={() => onItemSelect(searchResult)}>
          {searchResult.name}
        </div>
      )}

      {/* Mostrar lista de los primeros 10 Pokémon si no hay búsqueda */}
      {!searchResult &&
        pokemons.map((pokemon, index) => (
          <div
            key={index}
            style={listaItemEstilo}
            onClick={() => onItemSelect(pokemon)}
          >
            {pokemon.name}
          </div>
        ))}
    </div>
  );
};

export default Lista;
