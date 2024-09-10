import React, { useEffect, useState } from "react";
import axios from "axios";

interface PokemonDetailsProps {
  pokemon: { name: string; url: string } | null;
}

interface PokemonDetails {
  id: number;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  moves: { move: { name: string } }[];
}

const DetallesItem: React.FC<PokemonDetailsProps> = ({ pokemon }) => {
  const [details, setDetails] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    if (pokemon) {
      // Llamada a la API para obtener los detalles del Pokémon
      axios
        .get(pokemon.url)
        .then((response) => {
          setDetails(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, [pokemon]);

  const detallesEstilo: React.CSSProperties = {
    flex: 2,
    padding: "10px",
    textAlign: "center",
  };

  if (!pokemon) {
    return (
      <div style={detallesEstilo}>
        Selecciona un Pokémon para ver los detalles
      </div>
    );
  }

  if (!details) {
    return <div style={detallesEstilo}>Cargando detalles...</div>;
  }

  return (
    <div style={detallesEstilo}>
      <h2>{` ${pokemon.name} #${details.id}`}</h2>
      <img src={details.sprites.front_default} alt={pokemon.name} />
      <p>
        <strong>Tipo(s):</strong>{" "}
        {details.types.map((type) => type.type.name).join(", ")}
      </p>
      <p>
        <strong>Ataques:</strong>
      </p>
      <ul>
        {details.moves.slice(0, 2).map((move, index) => (
          <li key={index}>{move.move.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DetallesItem;
