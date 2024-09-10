import React, { useState } from "react";
import axios from "axios";

// Definir el objeto que contiene las ventajas de los tipos
const typeAdvantages: { [key: string]: string[] } = {
  fire: ["grass"],
  water: ["fire"],
  grass: ["water"],
};

interface PokemonDetails {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  moves: { move: { name: string } }[];
}

const Batalla: React.FC = () => {
  const [pokemon1, setPokemon1] = useState<PokemonDetails | null>(null);
  const [pokemon2, setPokemon2] = useState<PokemonDetails | null>(null);
  const [searchTerm1, setSearchTerm1] = useState<string>(""); // Para Pokémon 1
  const [searchTerm2, setSearchTerm2] = useState<string>(""); // Para Pokémon 2
  const [winner, setWinner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Función para buscar un Pokémon desde la API
  const fetchPokemon = async (
    searchTerm: string,
    setPokemon: (pokemon: PokemonDetails) => void
  ) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      );
      setPokemon(response.data);
      setError(null);
    } catch (error) {
      setError("Pokémon no encontrado.");
      console.error(error);
    }
  };

  const determineWinner = () => {
    if (pokemon1 && pokemon2) {
      const pokemon1Type = pokemon1.types[0].type.name;
      const pokemon2Type = pokemon2.types[0].type.name;

      if (typeAdvantages[pokemon1Type]?.includes(pokemon2Type)) {
        setWinner(pokemon1.name);
      } else if (typeAdvantages[pokemon2Type]?.includes(pokemon1Type)) {
        setWinner(pokemon2.name);
      } else {
        setWinner("Empate");
      }
    }
  };

  const handleBattle = () => {
    if (pokemon1 && pokemon2) {
      determineWinner();
    }
  };

  const contenedorEstilo: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "50vh",
    marginTop: "-470px",
  };

  const cuadradoEstilo: React.CSSProperties = {
    display: "flex",
    width: "50%",
    height: "100%",
    border: "1px solid black",
    backgroundColor: "white",
  };

  const pokemonEstilo: React.CSSProperties = {
    flex: 1,
    padding: "10px",
    borderRight: "1px solid #ccc",
    textAlign: "center",
  };

  const resultadoEstilo: React.CSSProperties = {
    marginTop: "20px",
    textAlign: "center",
  };

  return (
    <div>
      <div></div>
      <div style={contenedorEstilo}>
        <div style={cuadradoEstilo}>
          <div style={pokemonEstilo}>
            <h3>Selecciona el primer Pokémon</h3>
            <input
              type="text"
              value={searchTerm1}
              onChange={(e) => setSearchTerm1(e.target.value)}
              placeholder="Nombre o ID del Pokémon"
            />
            <button onClick={() => fetchPokemon(searchTerm1, setPokemon1)}>
              Buscar Pokémon 1
            </button>

            {pokemon1 && (
              <div>
                <h4>{pokemon1.name}</h4>
                <img src={pokemon1.sprites.front_default} alt={pokemon1.name} />
                <p>
                  <strong>Tipo(s):</strong>{" "}
                  {pokemon1.types.map((t) => t.type.name).join(", ")}
                </p>
                <p>
                  <strong>Ataques:</strong>
                </p>
                <ul>
                  {pokemon1.moves.slice(0, 2).map((move, index) => (
                    <li key={index}>{move.move.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={pokemonEstilo}>
            <h3>Selecciona el segundo Pokémon</h3>
            <input
              type="text"
              value={searchTerm2}
              onChange={(e) => setSearchTerm2(e.target.value)}
              placeholder="Nombre o ID del Pokémon"
            />
            <button onClick={() => fetchPokemon(searchTerm2, setPokemon2)}>
              Buscar Pokémon 2
            </button>

            {pokemon2 && (
              <div>
                <h4>{pokemon2.name}</h4>
                <img src={pokemon2.sprites.front_default} alt={pokemon2.name} />
                <p>
                  <strong>Tipo(s):</strong>{" "}
                  {pokemon2.types.map((t) => t.type.name).join(", ")}
                </p>
                <p>
                  <strong>Ataques:</strong>
                </p>
                <ul>
                  {pokemon2.moves.slice(0, 2).map((move, index) => (
                    <li key={index}>{move.move.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {winner && (
        <div style={resultadoEstilo}>
          <h3>Resultado de la Batalla</h3>
          <p>
            {winner === "Empate" ? "Es un empate" : `El ganador es: ${winner}`}
          </p>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleBattle} disabled={!pokemon1 || !pokemon2}>
          ¡Batallar!
        </button>
      </div>
    </div>
  );
};

export default Batalla;
