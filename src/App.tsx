import React from "react";
import "./Styles.css";
import Plantilla from "./components/Plantilla";
import Batalla from "./components/Batalla";

function App() {
  return (
    <>
      <h1>Pokédex - Estación de Batalla</h1>
      <Plantilla />

      <Batalla />
    </>
  );
}

export default App;
