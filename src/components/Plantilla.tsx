import React, { useState } from "react";
import Lista from "./Lista";
import DetallesItem from "./DetallesItem";

function Plantilla() {
  const [selectedPokemon, setSelectedPokemon] = useState<{
    name: string;
    url: string;
  } | null>(null);

  const contenedorEstilo: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
  };

  const cuadradoEstilo: React.CSSProperties = {
    display: "flex",
    width: "50%",
    height: "50%",
    border: "1px solid black",
    backgroundColor: "white",
  };

  return (
    <div style={contenedorEstilo}>
      <div style={cuadradoEstilo}>
        <Lista onItemSelect={setSelectedPokemon} />
        <DetallesItem pokemon={selectedPokemon} />
      </div>
    </div>
  );
}

export default Plantilla;
